# AquaCircle

NestJS + Prisma 專案

## 安裝依賴

```bash
npm install
```

## 設置資料庫

1. 複製 `.env.example` 為 `.env`
2. 修改 `.env` 中的 `DATABASE_URL` 為您的資料庫連線字串

## 執行 Prisma Migrations

```bash
# 生成 Prisma Client
npm run prisma:generate

# 執行資料庫遷移
npm run prisma:migrate
```

## 運行專案

```bash
# 開發模式
npm run start:dev

# 生產模式
npm run build
npm run start:prod
```

## 其他指令

```bash
# Prisma Studio (資料庫 GUI)
npm run prisma:studio

# 執行測試
npm run test

# Lint
npm run lint

# 格式化
npm run format
```

