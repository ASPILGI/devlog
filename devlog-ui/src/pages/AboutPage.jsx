export default function AboutPage() {
  return (
    <div
      style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', fontFamily: 'sans-serif' }}
    >
      <h1>About Devlog</h1>

      <section style={{ marginTop: 32 }}>
        <h2>이 프로젝트를 만든 이유</h2>
        <p style={{ lineHeight: 1.7 }}>
          Devlog는 단순한 기능 구현이 아니라,{' '}
          <strong>운영 환경을 전제로 한 백엔드 설계와 판단을 보여주기 위한 포트폴리오</strong>
          입니다.
          <br />
          <br />
          실제 업무에서는 인증/인가, 예외 처리, 배포, 운영 이슈 등을 경험했지만, 이를 하나의
          흐름으로 정리해 보여줄 수 있는 개인 프로젝트는 부족하다고 느꼈습니다.
          <br />
          그래서 “잘 돌아가는 코드”보다{' '}
          <strong>왜 이런 구조를 선택했는지, 운영 시 어떤 문제가 발생할 수 있는지</strong>를 설명할
          수 있는 Devlog 서비스를 직접 구현했습니다.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>설계 시 중요하게 본 기준</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li>
            인증/인가는 단순 기능이 아니라 <strong>구조로 설계</strong>되어야 한다
          </li>
          <li>
            예외와 응답은 <strong>일관된 규칙</strong>으로 관리되어야 한다
          </li>
          <li>
            로컬 환경과 운영 환경의 차이는 <strong>배포 단계에서 제거</strong>되어야 한다
          </li>
          <li>
            서비스는 “확장 가능성”보다 <strong>운영 안정성</strong>이 우선이다
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>기술적 구성</h2>
        <ul style={{ lineHeight: 1.8, paddingLeft: 18 }}>
          <li>Spring Boot / Spring Security 기반 백엔드 API</li>
          <li>JWT Access / Refresh Token 인증 구조</li>
          <li>Role 기반 접근 제어 (글 작성 권한 제한)</li>
          <li>ApiResponse + ErrorCode 기반 예외 처리 표준화</li>
          <li>Docker 기반 로컬/운영 환경 동일화</li>
          <li>AWS EC2 단일 서버 배포 및 운영</li>
        </ul>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>서비스 운영 방식</h2>
        <p style={{ lineHeight: 1.7 }}>
          Devlog는 <strong>단일 작성자(Owner) 기반의 Devlog 서비스</strong>입니다.
          <br />
          방문자는 로그인 없이 모든 글을 열람할 수 있으며, 회원가입은 가능하지만 글 작성은 작성자
          권한을 가진 계정만 허용합니다.
          <br />
          <br />
          이를 통해 사용자 접근성은 열어두되, 운영 리스크와 관리 복잡도는 최소화하는 구조를
          선택했습니다.
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h2>이 프로젝트를 통해 보여주고 싶은 것</h2>
        <p style={{ lineHeight: 1.7 }}>
          이 Devlog를 통해
          <br />
          <strong>
            “기능을 구현할 수 있는 개발자”가 아니라 “운영을 고려해 판단하고 설계할 수 있는 백엔드
            개발자”
          </strong>
          임을 보여주고자 합니다.
        </p>
      </section>
    </div>
  )
}
