# 魚缸管理功能 TDD 實作

## 概述

本目錄包含使用 TDD（Test-Driven Development）方式實作的魚缸管理功能，基於 `spec/features/魚缸管理.feature` 規格檔案。

## 檔案結構

```
test/aquarium/
├── 魚缸管理.e2e-spec.ts    # E2E 測試檔案（對應 Gherkin Feature）
├── aquarium.steps.ts        # Step definitions（備用）
└── README.md                # 本檔案
```

## 實作的功能

根據 `spec/features/魚缸管理.feature` 實作以下功能：

1. **建立魚缸** - POST `/aquariums`
   - 驗證長度、寬度、高度皆 > 0
   - 驗證狀態不可為空
   - 驗證狀態值必須為「開缸」、「穩定」、「治療」、「閒置」

2. **查詢所有魚缸** - GET `/aquariums`
   - 返回所有魚缸列表

3. **刪除魚缸** - DELETE `/aquariums/:id`
   - 刪除指定魚缸（不檢查相關聯資料）

## 執行測試

### 前置需求

1. 已安裝並啟動 Docker（E2E 會透過 Testcontainers 自動啟 PostgreSQL）。
2. 不需要手動先 `docker-compose up` 或先準備本機測試資料庫。

### 執行 E2E 測試

```bash
npm run test:e2e:aquarium
```

### 執行所有 E2E 測試

```bash
npm run test:e2e
```

## Testcontainers 與 Seed 擴充點

- 共用測試資料庫啟停與重置在 `test/helpers/test-db.ts`。
- 共用 Nest app 建立流程在 `test/helpers/e2e-app.ts`。
- 若需要在每次測試前預放資料，可在建立 context 時傳入 seed hook：

```ts
import { createE2eContext } from '../helpers/e2e-app';

const e2e = await createE2eContext(async (prisma) => {
  await prisma.aquarium.create({
    data: {
      name: 'Seed 魚缸',
      length: 120,
      width: 50,
      height: 60,
      status: '穩定',
      setupDate: '2025-01-01',
    },
  });
});
```

- seed hook 會在每次 `reset()` 後被呼叫，方便在不同 feature 測試建立固定初始資料。

## 測試涵蓋範圍

測試檔案 `魚缸管理.e2e-spec.ts` 涵蓋了以下 Gherkin Examples：

1. ✅ 魚缸長度、寬度、高度皆 > 0，成功建立
2. ✅ 魚缸長度、寬度、高度任一小於 0，建立魚缸失敗
3. ✅ 魚缸狀態為「開缸」，成功建立
4. ✅ 魚缸狀態為空，建立魚缸失敗
5. ✅ 魚缸存在，查詢所有魚缸成功
6. ✅ 不存在任何魚缸，查詢所有魚缸結果為空
7. ✅ 刪除魚缸但保留相關資料

## 實作的程式碼

### Service Layer
- `src/aquarium/aquarium.service.ts` - 業務邏輯實作

### Controller Layer
- `src/aquarium/aquarium.controller.ts` - HTTP 端點處理

### DTO
- `src/aquarium/dto/create-aquarium.dto.ts` - 資料傳輸物件

### Module
- `src/aquarium/aquarium.module.ts` - NestJS 模組定義

### Database Schema
- `prisma/schema.prisma` - Prisma 資料模型定義（Aquarium 模型）

## 注意事項

- 測試會自動清理測試資料（beforeEach 和 afterAll）
- 確保測試環境的資料庫與開發環境分離
- 測試需要實際的資料庫連線，不支援 mock

