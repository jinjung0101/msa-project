# 이벤트/보상 관리 시스템 (Event & Reward Management Platform)

이 레포지토리는 NestJS 기반의 MSA(Microservices Architecture)로 구현된 이벤트/보상 관리 시스템입니다. Gateway, Auth, Event 총 3개의 서비스로 구성되며, JWT 인증 및 권한(Role) 제어를 통해 운영자, 사용자, 감사자의 역할을 분리합니다.

---

## 🧩 기술 스택

* **Node.js**: v18
* **NestJS**: 최신(11.x)
* **TypeScript**: 엄격 모드(strict)
* **MongoDB**: NoSQL 데이터베이스
* **JWT**: 인증 토큰 발급
* **Docker & Docker Compose**: 컨테이너 기반 개발/배포
* **pnpm**: 패키지 매니저
* **Zod**: 런타임 스키마 검증

---

## 🎯 설계 원칙 및 구조 이유

이 시스템은 다음 설계 원칙과 구조를 기반으로 개발되었습니다:

### 설계 원칙

* **SOLID 원칙**: 단일 책임, 개방-폐쇄, 리스코프 치환, 인터페이스 분리, 의존 역전 원칙을 준수하여 각 클래스와 모듈이 명확한 역할을 가집니다.
* **코드 재사용성(Reusability)**: 공통 로직과 유틸은 `packages/share`와 `packages/infrastructure`로 모듈화하여 중복을 최소화했습니다.
* **타입 안정성(Type Safety)**: TypeScript의 엄격 모드를 활용하고, 런타임 스키마 검증을 위해 Zod를 도입하여 컴파일 단계와 실행 단계 모두에서 타입 오류를 방지합니다.
* **포트 & 어댑터 패턴(Port & Adapter Pattern)**: 각 계층의 의존성을 역전시키고 인터페이스에만 의존하도록 설계하여 느슨한 결합, 테스트 용이성, 구현체 변경 최소화를 달성합니다.

### Monorepo + PNPM Workspace

**이유:** 여러 서비스(Gateway, Auth, Event)와 공통 패키지(Shared, Infrastructure)를 한 곳에서 관리하여 코드 재사용성과 변경 반영 속도를 극대화하기 위해 선택했습니다.

**효과:** 공통 의존성 일관성 유지, 패키지 간 참조 손쉬움, 일괄 빌드/릴리즈

### TypeScript Project References

**이유:** `tsconfig.json`의 `references`와 `composite` 설정을 통해 증분 빌드를 활용하여 전체 빌드 시간을 단축하고 의존성 그래프를 명확히 관리합니다.

**효과:** 앱 변경 시 관련 패키지만 재빌드, 빠른 CI 응답

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

* **Gateway**: [http://localhost:3000](http://localhost:3000)
* **Auth**   : [http://localhost:3001](http://localhost:3001)
* **Event**  : [http://localhost:3002](http://localhost:3002)

---

## 🔐 환경 변수 (.env)

```dotenv
# 공통
JWT_SECRET=
MONGO_URI= 

# Gateway
AUTH_SERVICE_URL=http://gateway:3000/auth
EVENT_SERVICE_URL=http://gateway:3000/events

# Auth
AUTH_PORT=3001

# Event
EVENT_PORT=3002

GATEWAY_PORT=3000
```

---

## 📦 서비스별 주요 기능 및 엔드포인트

### 1. Gateway Service

* JWT 검증 및 Role 기반 권한 제어
* Auth, Event 서비스로 프록시 라우팅

| 메서드   | 경로                              | 설명                |
| ----- | ------------------------------- | ----------------- |
| POST  | /auth/register                  | 회원가입              |
| POST  | /auth/login                     | 로그인 및 JWT 발급      |
| PATCH | /auth/users/\:username/role     | 사용자 롤 변경          |
| GET   | /events                         | 이벤트 목록 조회         |
| GET   | /events/\:id                    | 이벤트 상세 조회         |
| POST  | /events                         | 이벤트 생성            |
| PATCH | /events/\:id/status             | 이벤트 상태(활성/비활성) 수정 |
| GET   | /events/\:id/reward-definitions | 보상 정의 목록 조회       |

### 2. Auth Service

* 사용자 등록, 로그인, 롤 관리
* JWT 발급 및 검증

| 메서드   | 경로                          | 설명                      |
| ----- | --------------------------- | ----------------------- |
| POST  | /auth/register              | 회원가입                    |
| POST  | /auth/login                 | 로그인 및 토큰 발급             |
| PATCH | /auth/users/\:username/role | 사용자 롤 변경 (ADMIN만)       |
| GET   | /auth/me                    | 내 정보 조회                 |
| GET   | /auth/users                 | 전체 사용자 목록 조회 (AUDITOR만) |

### 3. Event Service

* 이벤트 생성·조회·수정·비활성화
* 보상 정의 등록·조회
* 유저 보상 요청 처리 및 이력 조회

| 메서드   | 경로                                   | 설명                                        |
| ----- | ------------------------------------ | ----------------------------------------- |
| POST  | /events                              | 이벤트 생성 (ADMIN, OPERATOR)                  |
| GET   | /events                              | 이벤트 목록 조회                                 |
| GET   | /events/\:id                         | 이벤트 상세 조회                                 |
| PATCH | /events/\:id/deactivate              | 이벤트 비활성화 (ADMIN 전용)                       |
| POST  | /events/\:eventId/reward-definitions | 보상 정의 일괄 등록                               |
| GET   | /events/\:eventId/reward-definitions | 보상 정의 조회                                  |
| POST  | /rewards                             | 보상 지급 (OPERATOR, ADMIN)                   |
| GET   | /rewards                             | 보상 지급 내역 조회 (AUDITOR, ADMIN, OPERATOR)    |
| POST  | /reward-requests                     | 유저 보상 요청 (USER만)                          |
| GET   | /reward-requests/my                  | 내 보상 요청 이력 조회 (USER)                      |
| GET   | /reward-requests                     | 전체 보상 요청 이력 조회 (ADMIN, OPERATOR, AUDITOR) |

---

## 🧪 테스트

* **Auth**: `pnpm test` (jest 기반, 최소 테스트 포함)
* 나머지 서비스는 추후 통합 테스트 추가 예정


