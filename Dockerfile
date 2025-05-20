# ──────────────────────────────────────────────────────────
# 1) monorepo 전체 빌드 스테이지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /monorepo

# pnpm + tsc CLI 설치
RUN npm install -g pnpm@latest typescript

# 워크스페이스 메타파일 및 전체 소스 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./
COPY packages packages
COPY apps     apps

# 전체 의존성 설치 및 빌드
RUN pnpm install --frozen-lockfile
RUN pnpm run build


# ──────────────────────────────────────────────────────────
# 2) Auth 런타임 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS auth-runtime
WORKDIR /app

# 빌더의 node_modules와 dist/auth를 그대로 가져오기
COPY --from=builder /monorepo/node_modules ./node_modules
COPY --from=builder /monorepo/dist/auth ./dist

# 공통 share 패키지는 이미 node_modules 안에 존재
EXPOSE 3001
CMD ["node", "dist/main.js"]


# ──────────────────────────────────────────────────────────
# 3) Event 런타임 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS event-runtime
WORKDIR /app

COPY --from=builder /monorepo/node_modules ./node_modules
COPY --from=builder /monorepo/dist/event ./dist

EXPOSE 3002
CMD ["node", "dist/main.js"]


# ──────────────────────────────────────────────────────────
# 4) Gateway 런타임 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS gateway-runtime
WORKDIR /app

COPY --from=builder /monorepo/node_modules ./node_modules
COPY --from=builder /monorepo/dist/gateway ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
