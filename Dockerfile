# ──────────────────────────────────────────────────────────
# 0) 공통 베이스 이미지
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS base
WORKDIR /monorepo

RUN npm install -g pnpm@latest typescript
COPY .npmrc pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.* ./

# ──────────────────────────────────────────────────────────
# 1) Monorepo 전체 빌드
# ──────────────────────────────────────────────────────────
FROM base AS builder
COPY packages packages
COPY apps     apps

RUN pnpm install --no-frozen-lockfile
RUN pnpm run build


# ──────────────────────────────────────────────────────────
# 2) Auth 런타임
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS auth-runtime
WORKDIR /app

COPY --from=builder /monorepo/node_modules ./node_modules
COPY --from=builder /monorepo/dist/share          ./node_modules/@my-msa-project/share/dist
COPY --from=builder /monorepo/dist/infrastructure  ./node_modules/@my-msa-project/infrastructure/dist

RUN mkdir -p dist

COPY --from=builder /monorepo/dist/auth/.            ./dist

ENV NODE_PATH=./dist:./node_modules
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]

# ──────────────────────────────────────────────────────────
# 3) Event 런타임 
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS event-runtime
WORKDIR /app

COPY --from=builder /monorepo/node_modules ./node_modules
COPY --from=builder /monorepo/dist/share          ./node_modules/@my-msa-project/share/dist
COPY --from=builder /monorepo/dist/infrastructure  ./node_modules/@my-msa-project/infrastructure/dist

RUN mkdir -p dist
COPY --from=builder /monorepo/dist/event/.            ./dist

ENV NODE_PATH=./dist:./node_modules
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]

# ──────────────────────────────────────────────────────────
# 4) Gateway 런타임
# ──────────────────────────────────────────────────────────
FROM node:18-alpine AS gateway-runtime
WORKDIR /app

COPY --from=builder /monorepo/node_modules ./node_modules
COPY --from=builder /monorepo/dist/share          ./node_modules/@my-msa-project/share/dist
COPY --from=builder /monorepo/dist/infrastructure  ./node_modules/@my-msa-project/infrastructure/dist

RUN mkdir -p dist
COPY --from=builder /monorepo/dist/gateway/.            ./dist

ENV NODE_PATH=./dist:./node_modules
CMD ["node", "-r", "tsconfig-paths/register", "dist/main.js"]
