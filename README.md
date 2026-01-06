# Devlog – JWT 기반 인증/권한 블로그 백엔드 API

Spring Boot 기반의 블로그 REST API입니다.  
JWT 인증/인가, 권한 처리, 예외 응답 통일 등 **실무에서 바로 사용할 수 있는 백엔드 구조**를 목표로 설계했습니다.

> 목적  
> 단순 CRUD 구현이 아니라 **실무에서 사용하는 인증·권한·예외 처리 구조를 직접 설계하고,  
> 그 이유를 설명할 수 있는 상태를 만드는 것**입니다.

## 기술 스택

- Java 17
- Spring Boot
- Spring Security
- JPA (Hibernate)
- MariaDB
- JWT (Access Token / Refresh Token)
- IntelliJ HTTP Client (`auth.http`)

---

## 아키텍처 개요

Controller → Service (비즈니스 로직 / 권한 체크 / 트랜잭션) → Repository

- 인증/인가: JWT + Spring Security
- 비즈니스 예외: BusinessException + ErrorCode
- 응답 포맷: ApiResponse<T>
- 전역 예외 처리: GlobalExceptionHandler

> Controller는 요청/응답 책임만 가지며,  
> **비즈니스 판단과 트랜잭션은 Service 계층에서 처리**하도록 분리했습니다.

---

## 인증 / 권한 설계 (Why)

### JWT를 선택한 이유
- 서버가 로그인 상태를 보관하지 않는 **Stateless 구조**
- API 서버 수평 확장에 유리
- 프론트엔드 / 모바일 환경과 호환성 우수

### Access / Refresh Token 분리 이유
- Access Token은 짧은 수명으로 탈취 시 피해를 최소화
- Refresh Token은 DB에 저장하여 **강제 만료 / 로그아웃 제어 가능**

### 설계 대안 검토
- 세션 기반 인증 방식도 검토했으나,
  API 중심 구조와 서버 확장성을 고려해 JWT 방식을 선택했습니다.
- 세션 기반처럼 서버가 로그인 상태를 보관하지 않아도 동작하므로,
  서버 수평 확장 시 세션 공유(Sticky Session / Redis)와 같은
  추가 구조가 덜 필요하다고 판단했습니다.

---

## 인증 흐름 상세 (How)

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
- Spring Security에서 처리
- 인증 실패 시 401 반환

### 비즈니스 권한 (작성자 체크)
- Service 계층에서 직접 검사
- 작성자 불일치 시 AccessDeniedException 발생
- GlobalExceptionHandler에서 403으로 응답

---

## 예외 처리 전략

### 비즈니스 예외
- Service 계층에서 BusinessException 발생
- GlobalExceptionHandler에서 처리

### 검증 오류
- @Valid 실패 시 MethodArgumentNotValidException 발생
- GlobalExceptionHandler에서 처리

### 권한 오류
- Service 계층: `AccessDeniedException`
- Security 필터 단계:
    - `AuthenticationEntryPoint`
    - `AccessDeniedHandler`

> **Security 필터 단계 예외와 서비스 계층 예외를 분리**하여  
> 예외 흐름을 명확히 했습니다.

---

## HTTP 상태 코드 정책
- 400 : 잘못된 요청
- 401 : 인증 실패
- 403 : 권한 없음
- 404 : 리소스 없음
- 409 : 중복 데이터
- 500 : 서버 오류

---

## 트랜잭션 설계

- 트랜잭션은 **Service 계층에서 관리**
- 조회 로직은 `@Transactional(readOnly = true)` 적용
- 트랜잭션 범위를 Service 계층으로 제한하여  
  Controller가 비즈니스 상태 변경에 관여하지 않도록 설계했습니다.

**설계 이유**
- 쓰기 / 읽기 책임 분리
- 불필요한 변경 감지 비용 감소
- 실무에서 사용하는 트랜잭션 패턴과 동일

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

## 테스트 방법

### IntelliJ HTTP Client (`auth.http`)
- 위에서 아래 순서대로 실행하면 전체 시나리오 재현 가능
    - 회원가입
    - 로그인
    - 게시글 / 댓글 CRUD
    - 권한 실패(403) 케이스 확인

> 요청 이력을 코드처럼 관리하기 위해 IntelliJ HTTP Client를 사용했습니다.

--- 

## 프로젝트에서 고민한 점
- 인증/인가 로직과 비즈니스 권한 로직을 분리하여 책임을 명확히 하고자 했습니다.
- 비즈니스 예외를 `BusinessException` 하나로 통합하고,  
  HTTP 상태 코드는 `ErrorCode`에서 관리하도록 설계했습니다.
- Security 필터 단계의 예외와 Service 계층 예외를 분리하여 예외 흐름을 명확히 했습니다.

--- 

## 향후 개선 사항
- 좋아요 기능 추가 및 사용자 반응 데이터 관리
- 검색 기능 및 페이징 고도화
- 배포 환경 구성 및 운영 고려
    - 환경 변수 분리 및 시크릿 키 관리
    - HTTPS 적용
    - Refresh Token 저장소 확장 시 캐시 도입 검토 (트래픽 증가 대비)