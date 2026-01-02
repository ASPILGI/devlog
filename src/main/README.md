# Devlog API

JWT 기반 인증/인가를 사용하는 블로그 백엔드 서비스입니다.  
회원가입, 로그인, 게시글/댓글 CRUD, 권한 처리, 예외 응답 통일을 목표로 설계했습니다.

> 목적: 실무에서 사용하는 인증·권한·예외 처리 구조를 직접 구현하고 설명 가능하게 만드는 것

## 기술 스택

- Java 17
- Spring Boot
- Spring Security
- JPA (Hibernate)
- MariaDB
- JWT (Access / Refresh)
- IntelliJ HTTP Client (`auth.http`)

---

## 아키텍처 개요

- 인증/인가: JWT + Spring Security
- 비즈니스 예외: BusinessException + ErrorCode
- 응답 포맷: ApiResponse<T>
- 전역 예외 처리: GlobalExceptionHandler

> Controller → Service (비즈니스 로직 및 권한 체크) → Repository

---

## 인증 흐름 (JWT)

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

### 비즈니스 오류
- Service 계층에서 BusinessException 발생
- GlobalExceptionHandler에서 처리

### 검증 오류
- @Valid 실패 시 MethodArgumentNotValidException 발생
- GlobalExceptionHandler에서 처리

### 권한 오류
- Service 계층에서 AccessDeniedException 발생
- GlobalExceptionHandler에서 처리

### Security 필터 오류
- 인증 실패 및 권한 부족은 Security 필터 단계에서 처리
- AuthenticationEntryPoint / AccessDeniedHandler가 응답 생성

---

## HTTP 상태 코드 정책
- 400 : 잘못된 요청
- 401 : 인증 실패
- 403 : 권한 없음
- 404 : 리소스 없음
- 409 : 중복 데이터
- 500 : 서버 오류

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

### auth.http 파일 실행
- 위에서 아래 순서대로 실행하면 전체 시나리오 재현 가능
- 회원가입
- 로그인
- 게시글/댓글 CRUD
- 권한 실패(403) 확인

--- 

## 프로젝트에서 고민한 점
- 인증/인가 로직과 비즈니스 권한 로직을 분리하여 책임을 명확히 나누고자 했다.
- 비즈니스 예외를 BusinessException 하나로 통합하고, HTTP 상태 코드는 ErrorCode에서 관리하도록 설계했다.
- Security 필터 단계의 예외와 서비스 계층 예외를 분리하여 예외 흐름을 명확히 했다.

--- 

## 향후 개선 사항
- 좋아요 기능 추가
- 검색 기능 구현
- 배포 자동화(Docker / CI)
