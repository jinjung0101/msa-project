# ──────────────────────────────────────────────────────────
# 1) monorepo 전체 빌드 스테이지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /monorepo

# pnpm + tsc CLI 설치
RUN npm install -g pnpm@latest typescript

# workspace 정의 파일들 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json tsconfig.json ./

# 소스 전체 복사 (packages + apps)
COPY packages packages
COPY apps     apps

# 의존성 설치 & 전체 빌드 (build 스크립트가 tsc -b 순차 실행)
RUN pnpm install --frozen-lockfile
RUN pnpm run build


# ──────────────────────────────────────────────────────────
# 2) Auth 런타임 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS auth-runtime
WORKDIR /app

# prod용 의존성만 설치
RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# 빌더에서 만든 auth 결과물만 복사
COPY --from=builder /monorepo/dist/auth ./dist

RUN mkdir -p node_modules/@my-msa-project
COPY --from=builder /monorepo/packages/share/dist \
                     node_modules/@my-msa-project/share

EXPOSE 3001
CMD ["node", "dist/main.js"]


# ──────────────────────────────────────────────────────────
# 3) Event 런타임 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS event-runtime
WORKDIR /app

RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /monorepo/dist/event ./dist

RUN mkdir -p node_modules/@my-msa-project
COPY --from=builder /monorepo/packages/share/dist \
                     node_modules/@my-msa-project/share

EXPOSE 3002
CMD ["node", "dist/main.js"]


# ──────────────────────────────────────────────────────────
# 4) Gateway 런타임 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS gateway-runtime
WORKDIR /app

RUN npm install -g pnpm@latest
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /monorepo/dist/gateway ./dist

RUN mkdir -p node_modules/@my-msa-project
COPY --from=builder /monorepo/packages/share/dist \
                     node_modules/@my-msa-project/share

EXPOSE 3000
CMD ["node", "dist/main.js"]
