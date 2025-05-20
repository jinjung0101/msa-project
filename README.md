# 이벤트/보상 관리 시스템 (Event & Reward Management Platform)

이 레포지토리는 NestJS 기반의 MSA(Microservices Architecture)로 구현된 이벤트/보상 관리 시스템입니다. Gateway, Auth, Event 총 3개의 서비스로 구성되며, JWT 인증 및 권한(Role) 제어를 통해 운영자, 사용자, 감사자의 역할을 분리합니다.

---

## 🧩 기술 스택

- **Node.js**: v18
- **NestJS**: 최신(11.x)
- **TypeScript**: 엄격 모드(strict)
- **MongoDB**: NoSQL 데이터베이스
- **JWT**: 인증 토큰 발급
- **Docker & Docker Compose**: 컨테이너 기반 개발/배포
- **pnpm**: 패키지 매니저
- **Zod**: 런타임 스키마 검증

---

## 🎯 설계 원칙 및 구조 이유

이 시스템은 다음 설계 원칙과 구조를 기반으로 개발되었습니다:

### 🏗️ 설계 원칙

- **SOLID 원칙**: 단일 책임, 개방-폐쇄, 리스코프 치환, 인터페이스 분리, 의존 역전 원칙을 준수하여 각 클래스와 모듈이 명확한 역할을 가집니다.
- **코드 재사용성(Reusability)**: 공통 로직과 유틸은 `packages/share`와 `packages/infrastructure`로 모듈화하여 중복을 최소화했습니다.
- **타입 안정성(Type Safety)**: TypeScript의 엄격 모드를 활용하고, 런타임 스키마 검증을 위해 Zod를 도입하여 컴파일 단계와 실행 단계 모두에서 타입 오류를 방지합니다.
- **포트 & 어댑터 패턴(Port & Adapter Pattern)**: 각 계층의 의존성을 역전시키고 인터페이스에만 의존하도록 설계하여 느슨한 결합, 테스트 용이성, 구현체 변경 최소화를 달성하고자 했습니다.

### 📦 Monorepo & pnpm Workspace

**이유:** 여러 서비스(Gateway, Auth, Event)와 공통 패키지(Shared, Infrastructure)를 한 곳에서 관리하여 코드 재사용성과 변경 반영 속도를 극대화하기 위해 선택했습니다.

**효과:** 공통 의존성 일관성 유지, 패키지 간 참조 손쉬움, 일괄 빌드/릴리즈

### 🚀 TypeScript 프로젝트 참조

**이유:** `tsconfig.json`의 `references`와 `composite` 설정을 통해 증분 빌드를 활용하여 전체 빌드 시간을 단축하고 의존성 그래프를 명확히 관리합니다.

**효과:** 앱 변경 시 관련 패키지만 재빌드, 빠른 CI 응답

## 🛠️ 구현 중 겪은 고민

### 🔐 동시 로그인 경합 방지

MongoDB의 `findOneAndUpdate` 원자(atomic) 연산을 사용하여, 로그인할 때 userId별 `Session` 문서를 upsert합니다. 이로써 두 개의 거의 동시 로그인 시도 중 마지막 연산만 세션에 반영되어, 이전 토큰은 자동으로 무효화됩니다.

### 🌐 오토스케일링 환경에서 보상 동시 요청 처리

#### 고유 인덱스의 원자성

MongoDB의 인덱스 제약 조건은 클러스터 전체(replica set)에서 원자적으로 동작합니다.

```js
RewardRequestSchema.index(
  { userId: 1, eventId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "approved"] } },
  }
);
```

위와 같이 인덱스를 설정하면, 어떤 인스턴스에서 먼저 삽입 요청이 들어오더라도 해당 레코드만 생성되고, 이후 요청은 **duplicate key error (E11000)** 가 발생하여 애플리케이션에서 예외 처리할 수 있습니다.

### 서비스 레이어에서의 에러 핸들링

1. 여러 서버에서 거의 동시에 `repo.create(...)`를 호출해도, 첫 번째 호출만 레코드가 생성됩니다.
2. 두 번째 호출부터는 고유 인덱스 위반으로 **duplicate key error** 발생
3. 서비스 레이어에서 해당 에러를 잡아 “이미 요청된 이벤트입니다” 라고 응답하면 됩니다.

별도의 락(lock)이나 트랜잭션 없이도 중복 수령 시도를 안전하게 차단할 수 있습니다.

## 📁 프로젝트 구조

```
my-msa-project/
├─ packages/           # 공통 모듈(shared, infrastructure)
│  ├─ share/           # 스키마 및 DTO 정의 (zod, ts-rest)
│  └─ infrastructure/  # 공통 NestJS 모듈(공통셋업, Mongoose 등)
├─ apps/
│  ├─ gateway/         # API 진입점, 인증·권한 검사, 라우팅
│  ├─ auth/            # 사용자 관리, JWT 발급, 역할 부여
│  └─ event/           # 이벤트 관리, 보상 정의·요청 처리
├─ docker-compose.yml         # 로컬 개발용
├─ docker-compose.prod.yml    # 프로덕션 배포용
└─ Dockerfile                 # 멀티 스테이지 빌드
```

---

## ⚙️ 사전 준비

1. Node.js v18 설치
2. pnpm 설치 (`npm install -g pnpm`)
3. Docker & Docker Compose 설치
4. MongoDB 실행 (docker-compose 포함)

---

## 🚀 로컬 개발 환경 실행

```bash
# 루트 디렉토리에서
pnpm install
pnpm run build         # 타입스크립트 컴파일 (packages + apps)

docker-compose up --build
```

- **Gateway**: [http://localhost:3000](http://localhost:3000)
- **Auth** : [http://localhost:3001](http://localhost:3001)
- **Event** : [http://localhost:3002](http://localhost:3002)

---

## 🔐 환경 변수 (.env)

```dotenv
# 공통
JWT_SECRET=
MONGO_URI=

# Gateway
GATEWAY_PORT=3000
AUTH_SERVICE_URL=http://gateway:3000/auth
EVENT_SERVICE_URL=http://gateway:3000/events

# Auth
AUTH_PORT=3001

# Event
EVENT_PORT=3002
```

## 🧪 테스트

- **Auth**: `pnpm test` (jest 기반, 최소 테스트 포함)
- 나머지 서비스는 추후 통합 테스트 추가 예정
