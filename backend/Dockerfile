# 使用 Node.js LTS 版本
FROM node:20-alpine AS base

# 安裝必要的系統依賴
RUN apk add --no-cache libc6-compat openssl

# 設定工作目錄
WORKDIR /app

# 複製依賴檔案
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci

# 生成 Prisma Client
RUN npx prisma generate

# 複製所有源代碼
COPY . .

# 建構應用程式
RUN npm run build

# 暴露端口
EXPOSE 3000

# 開發環境階段（用於 docker-compose）
FROM base AS development

# 開發環境不需要額外配置
CMD ["npm", "run", "start:dev"]

# 生產環境階段
FROM node:20-alpine AS production

WORKDIR /app

# 安裝必要的系統依賴
RUN apk add --no-cache libc6-compat openssl

# 複製必要的檔案
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma

# 暴露端口
EXPOSE 3000

# 設定環境變數
ENV NODE_ENV=production

# 啟動應用程式
CMD ["npm", "run", "start:prod"]

