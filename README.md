   # Devlog – JWT 기반 인증/권한 블로그 백엔드 API

> Java / Spring Boot 기반으로
**JWT 인증·인가, 권한 분기, 예외 처리, 그리고 Docker 기반 CI/CD 배포까지 실무 기준으로 설계·구현한 백엔드 중심 개인 프로젝트**

### 🔹 Overview (한눈 요약)
- JWT Access / Refresh Token 인증 구조 직접 설계
- Spring Security 필터 ↔ Service 계층 책임 분리
- 인증 권한과 비즈니스 권한 분리 설계
- 실무 기준 예외 처리 · 트랜잭션 패턴 적용
- Docker + GitHub Actions 기반 자동 배포 환경 구축
- 최소 UI를 통한 인증·권한 정책 실제 동작 검증

👉 UI 구현이 아닌 **백엔드 설계와 운영 환경 검증**에 초점을 둔 프로젝트입니다.

---

## 🌐 Devlog (AWS 기반 운영 중)

👉 **https://aspilgi.com**

- EC2 + Nginx + HTTPS 적용
- 실제 배포 환경에서 인증 흐름 확인 가능

---

## 기술 스택

### Backend

- Java 17
- Spring Boot 3.x
- Spring Security
- JPA (Hibernate)
- MariaDB, Flyway
- JWT (Access / Refresh Token)

### Infra / DevOps
- AWS EC2 (Ubuntu)
- Docker / Docker Compose
- Nginx (Reverse Proxy)
- GitHub Actions
- GitHub Container Registry (GHCR)
- Self-hosted GitHub Actions Runner

### Test / Validation
- IntelliJ HTTP Client (auth.http)
- React (Minimal UI, 검증 목적)

---

## 아키텍처 개요

```
Client
  ↓
Nginx (Reverse Proxy)
  ↓
Spring Boot API (Docker)
  ↓
MariaDB (Docker)

Controller → Service → Repository  
```

- Service 계층:
    - 비즈니스 로직
    - 권한 검사
    - 트랜잭션 관리 담당
- Controller 계층:
    - 요청/응답 역할에 집중

### 공통 설계
- 인증/인가: JWT + Spring Security
- 비즈니스 예외: BusinessException + ErrorCode
- 응답 포맷: ApiResponse<T>
- 전역 예외 처리: GlobalExceptionHandler

---

## 인증 / 권한 설계 

### JWT를 선택한 이유
- Stateless 구조로 서버 확장성 확보
- API 중심 서비스 구조에 적합
- 프론트엔드 / 모바일 환경과 호환성 우수

### Access / Refresh Token 분리 이유
- Access Token: 짧은 수명 → 탈취 피해 최소화
- Refresh Token:
  - DB에 저장 
  - 강제 로그아웃 및 재발급 제어 가능

> 세션 기반 인증 방식도 검토했으나, 서버 수평 확장 시 세션 공유 비용을 줄이기 위해 JWT 방식을 선택했습니다.

---

## 인증 흐름 상세 

### 로그인
- `POST /api/v1/users/login`
- AccessToken + RefreshToken 발급
- RefreshToken은 DB 저장 (유저당 1개)

### AccessToken 사용
- `Authorization: Bearer {accessToken}`
- JwtAuthenticationFilter에서 검증 후 SecurityContext에 사용자 정보 저장

### 토큰 재발급
- `POST /api/v1/users/reissue`
- RefreshToken 검증 후 AccessToken만 재발급
- Refresh Token이 유효하지 않으면 재로그인 유도

### 로그아웃
- `POST /api/v1/users/logout`
- RefreshToken DB 삭제
- 기존 AccessToken은 만료 시까지 유효 (Stateless)

---

## 권한 처리 전략

### 인증 여부
- Spring Security 필터 단계에서 처리
- 인증 실패 시 401 반환

### 비즈니스 권한 (작성자 체크)
- Service 계층에서 직접 검사
- 작성자 불일치 시 AccessDeniedException 발생
- GlobalExceptionHandler에서 403으로 응답

---

## 예외 처리 전략

### 비즈니스 예외
- Service 계층에서 BusinessException

### 검증 오류
- @Valid 실패 시 MethodArgumentNotValidException

### 권한 오류
- Service 계층: `AccessDeniedException`
- Security 필터 단계:
    - `AuthenticationEntryPoint`
    - `AccessDeniedHandler`

> **Security 필터 단계 예외와 서비스 계층 예외를 분리**하여 예외 흐름을 명확히 했습니다.

---

## HTTP 상태 코드 정책

| 상태 코드 | 의미 |
|----------|------|
| 400 | 잘못된 요청 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 409 | 중복 데이터 |
| 500 | 서버 오류 |

---

## 트랜잭션 설계

- 트랜잭션은 Service 계층에서 관리
- 조회 로직은 `@Transactional(readOnly = true)` 적용
- 쓰기 / 읽기 책임 분리

**설계 이유**
- 불필요한 변경 감지 비용 감소
- 실무에서 사용하는 트랜잭션 범위 기준 적용

---

## API 목록

### User
- POST /api/v1/users/signup
- POST /api/v1/users/login
- GET /api/v1/users/me
- POST /api/v1/users/reissue
- POST /api/v1/users/logout

### Post
- POST /api/v1/posts
- GET /api/v1/posts/{id}
- GET /api/v1/posts?page=0&size=10
- PUT /api/v1/posts/{id}
- DELETE /api/v1/posts/{id}

### Comment
- POST /api/v1/posts/{postId}/comments
- GET /api/v1/posts/{postId}/comments
- PUT /api/v1/posts/{postId}/comments/{commentId}
- DELETE /api/v1/posts/{postId}/comments/{commentId}

---

## CI/CD & Deployment

### 목표
> SSH 없이, main 브랜치 push만으로도 자동 배포

### 배포 구조

```
git push (main)
   ↓
GitHub Actions
   - Docker Image Build
   - GHCR Push
   ↓
Self-hosted Runner (EC2)
   - docker compose pull
   - docker compose up -d --force-recreate
   ↓
Production 반영
```

### 특징
- scp / ssh 기반 수동 배포 제거
- 이미지 단위 배포로 서버 상태 일관성 확보
- 컨테이너 재생성(--force-recreate)으로 배포 반영 보장
- Spring Boot Actuator /actuator/health 로 배포 성공 여부 검증
```
curl -I http://127.0.0.1:8080/actuator/health
# HTTP/1.1 200 OK
```

--- 

## DB Migration (Flyway)

운영 환경에서 `ddl-auto=create/update`를 사용하지 않고,  
**Flyway 기반 마이그레이션으로 DB 스키마를 관리**합니다.

- `spring.jpa.hibernate.ddl-auto=validate` 고정
- 스키마 변경은 Flyway 마이그레이션 파일로만 수행
- Docker Compose 운영 환경에서도 앱 기동 시 자동 migrate

---

## 테스트 및 검증 방식

- IntelliJ HTTP Client(auth.http)로 인증·권한·CRUD 시나리오 검증
- 인증 실패(401), 권한 실패(403) 케이스 포함
- 요청 시나리오를 코드처럼 관리

---

## Minimal UI를 통한 검증

- 목적:
    - JWT 인증 흐름 검증
    - 권한 제어 정책 실제 동작 확인
- 모든 권한 판단은 백엔드에서 수행
- 프론트엔드는 UX 목적의 조건부 렌더링만 담당

---

## 향후 개선 사항
- 좋아요 기능 추가 및 사용자 반응 데이터 관리
- 검색 및 페이징 고도화
- 운영 환경 고도화
    - Refresh Token 저장소 확장 시 캐시 도입 검토 (트래픽 증가 대비)
    - 무중단 배포 구조(Blue/Green) 적용
