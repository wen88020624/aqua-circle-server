const { spawnSync } = require('node:child_process');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

function collectStepStatuses(featureJson) {
  const counts = {
    passed: 0,
    failed: 0,
    skipped: 0,
    pending: 0,
    undefined: 0,
    ambiguous: 0,
    unknown: 0,
  };

  for (const feature of featureJson) {
    for (const scenario of feature.elements || []) {
      for (const step of scenario.steps || []) {
        const status = step.result?.status || 'unknown';
        if (counts[status] === undefined) {
          counts.unknown += 1;
        } else {
          counts[status] += 1;
        }
      }
    }
  }

  return counts;
}

function collectScenarioCounts(featureJson) {
  let scenarios = 0;
  let failed = 0;

  for (const feature of featureJson) {
    for (const scenario of feature.elements || []) {
      scenarios += 1;
      const hasFailedStep = (scenario.steps || []).some(
        (step) => step.result?.status === 'failed',
      );
      if (hasFailedStep) {
        failed += 1;
      }
    }
  }

  return { scenarios, failed };
}

const tmpDir = mkdtempSync(join(tmpdir(), 'cucumber-summary-'));
const jsonReportPath = join(tmpDir, 'cucumber-report.json');

const featureArgs = process.argv.slice(2);

const run = spawnSync(
  'npx',
  [
    'cucumber-js',
    '--config',
    'cucumber.js',
    '--format',
    `json:${jsonReportPath}`,
    ...featureArgs,
  ],
  {
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf8',
  },
);

try {
  const testcontainersLogs = `${run.stdout || ''}\n${run.stderr || ''}`
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('[Testcontainers]'));
  for (const line of testcontainersLogs) {
    console.log(line);
  }

  const reportContent = readFileSync(jsonReportPath, 'utf8');
  const reportJson = JSON.parse(reportContent);
  const scenarioCounts = collectScenarioCounts(reportJson);
  const stepCounts = collectStepStatuses(reportJson);

  console.log(
    [
      `[BDD E2E Summary] scenarios=${scenarioCounts.scenarios}`,
      `failed_scenarios=${scenarioCounts.failed}`,
      `steps(passed=${stepCounts.passed}, failed=${stepCounts.failed}, undefined=${stepCounts.undefined}, pending=${stepCounts.pending}, skipped=${stepCounts.skipped})`,
    ].join(' | '),
  );
} catch (error) {
  console.error('[BDD E2E Summary] 無法解析 cucumber JSON 報告');
  if (run.stderr) {
    console.error(run.stderr.trim());
  }
}

rmSync(tmpDir, { recursive: true, force: true });
process.exit(run.status ?? 1);
