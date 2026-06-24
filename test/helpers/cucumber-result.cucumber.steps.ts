import assert from 'node:assert/strict';
import { DataTable, Then } from '@cucumber/cucumber';

interface ScenarioWorld {
  response?: {
    status: number;
    body: any;
  };
  dbAssertion?: (context: DbAssertionContext) => Promise<void> | void;
}

interface DbAssertionContext {
  success: boolean;
  message?: string;
  warning?: string;
  status?: string;
}

Then('操作結果應為', async function (this: ScenarioWorld, table: DataTable) {
  const row = table.hashes()[0] ?? {};
  const success = row.success === 'true';

  assert.ok(this.response, '缺少操作結果，請先執行 When 步驟');
  assert.equal(this.response.status >= 200 && this.response.status < 300, success);

  const expectedMessage = row.message ?? '';
  const expectedWarning = row.warning ?? '';
  const expectedStatus = row.status ?? '';

  if (!success && expectedMessage !== '') {
    assert.equal(this.response.body?.message, expectedMessage);
  }

  // 支援餵食記錄 warning 欄位
  if (Object.prototype.hasOwnProperty.call(row, 'warning')) {
    if (expectedWarning !== '') {
      assert.equal(this.response.body?.warning, expectedWarning);
    } else if (success) {
      assert.equal(this.response.body?.warning, undefined);
    }
  }

  // 支援耗材/設備回傳 status 欄位（在某些場景中 feature 會驗證）
  if (Object.prototype.hasOwnProperty.call(row, 'status')) {
    if (expectedStatus !== '' && success) {
      assert.equal(this.response.body?.status, expectedStatus);
    }
  }

  if (this.dbAssertion) {
    await this.dbAssertion({
      success,
      message: expectedMessage || undefined,
      warning: expectedWarning || undefined,
      status: expectedStatus || undefined,
    });
  }
});
