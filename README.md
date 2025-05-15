# My MSA Project

## 📖 소개

- 이 레포는 NestJS + pnpm Workspace 기반의 MSA 예제입니다.
- 포트-어댑터(헥사고날) 아키텍처로 설계되어 있습니다.

## 🏗️ 아키텍처

### 1. Port & Adapter 패턴

- **Domain**: 순수 비즈니스 모델, 유스케이스 인터페이스(Port)
- **Application**: 유스케이스 구현체, 외부에 노출하는 인터페이스
- **Adapter**: 인프라(HTTP 컨트롤러, MongoDB 리포지토리, RabbitMQ 등)
- 다이어그램 삽입(예: `docs/hexagon.png`)

### 2. Monorepo 구조

```

/
├─ apps/
│ ├─ auth/
│ ├─ event/
│ └─ gateway/
├─ packages/
│ └─ share/ # 공통 DTO, 인터페이스, 유틸
├─ Dockerfile
├─ docker-compose.yml
├─ package.json
└─ tsconfig.base.json

```

## 🚀 빠른 시작

```bash
# 전체 이미지 빌드
docker-compose build --no-cache

# 전체 컨테이너 실행
docker-compose up

# 개별 서비스만 띄우고 싶다면
docker build -t auth-img --target auth-runtime .
docker run -p 3001:3001 auth-img
```

## 🔧 개발 가이드

1. **Auth 서비스** (`apps/auth`)
2. **Event 서비스** (`apps/event`)
3. **Gateway 서비스** (`apps/gateway`)
4. **공통 코드** (`packages/share`) – DTO, 인터페이스, 예외 필터, 로깅

## ☁️ 배포

- 빌드: `docker build --target <서비스>-runtime -t my-msa-<서비스> .`
- 푸시: `docker push my-msa-<서비스>`
- Kubernetes/Cloud Run 예시

## 🎯 왜 포트-어댑터 패턴인가?

- 테스트 용이성 → 인메모리 어댑터 교체만으로 비즈니스 로직 단위 테스트 가능
- 인프라 변경에 유연 → MongoDB → PostgreSQL 등 어댑터만 교체
- 의존성 역전 → 도메인 계층이 인프라에 의존하지 않음
