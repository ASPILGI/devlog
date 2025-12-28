package com.aspilgi.devlog.auth.service;

import com.aspilgi.devlog.auth.jwt.JwtProperties;
import com.aspilgi.devlog.auth.jwt.JwtTokenProvider;
import com.aspilgi.devlog.auth.refresh.entity.RefreshToken;
import com.aspilgi.devlog.auth.refresh.repository.RefreshTokenRepository;
import com.aspilgi.devlog.user.dto.UserLoginRequest;
import com.aspilgi.devlog.user.dto.UserLoginResponse;
import com.aspilgi.devlog.user.dto.UserReissueRequest;
import com.aspilgi.devlog.user.dto.UserReissueResponse;
import com.aspilgi.devlog.user.entity.User;
import com.aspilgi.devlog.user.repository.UserRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Builder
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    @Transactional
    public UserLoginResponse login(UserLoginRequest request) {

        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 1) access token
        String accessToken = jwtTokenProvider.createAccessToken(user.getId(), user.getLoginId());

        // 2) refresh token
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId()); // (네가 jti 추가했으면 여기에도 반영)
        LocalDateTime refreshExp = LocalDateTime.now().plusDays(jwtProperties.getRefreshTokenExpDays());

        // 3) refresh 저장 (유저당 1개, 있으면 rotate)
        RefreshToken entity = refreshTokenRepository.findByUserId(user.getId())
                .orElseGet(() -> RefreshToken.builder()
                        .userId(user.getId())
                        .build());

        entity.rotate(refreshToken, refreshExp);

        refreshTokenRepository.save(entity);

        return UserLoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    @Transactional
    public void logout(String authorizationHeader) {
        String token = resolveBearerToken(authorizationHeader);

        // access 검증
        try {
            jwtTokenProvider.validate(token);
        } catch (Exception e) {
            throw new IllegalArgumentException("유효하지 않은 Access Token 입니다.");
        }

        Long userId = jwtTokenProvider.getUserId(token);

        // refresh 삭제 (유저당 1개 정책)
        refreshTokenRepository.deleteByUserId(userId);
    }

    private String resolveBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            throw new IllegalArgumentException("Authorization 헤더가 필요합니다.");
        }
        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Bearer 토큰 형식이 아닙니다.");
        }
        return authorizationHeader.substring(7);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReissueResponse reissue(UserReissueRequest request) {

        String refreshToken = request.getRefreshToken();

        // 1. refresh JWT 검증(서명/만료/파싱)
        if (!jwtTokenProvider.validate(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 Refresh Token 입니다.");
        }

        // 2. refresh에서 userId 추출
        Long userId = jwtTokenProvider.getUserId(refreshToken);

        // 3. DB에서 해당 유저의 refresh row 조회
        RefreshToken saved = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Refresh Token이 존재하지 않습니다."));

        // 4. 요청 refreshToken 과 DB refreshToken 일치 확인
        if (!refreshToken.equals(saved.getToken())) {
            throw new IllegalArgumentException("Refresh Token이 일치하지 않습니다.");
        }

        // 5. DB 기준 만료 체크 (JWT exp와 별개로 서버 정책 강제)
        if (saved.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다.");
        }

        // 6. access 발급에 필요한 loginId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 7. 새 accessToken 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(userId, user.getLoginId());

        return UserReissueResponse.builder()
                .accessToken(newAccessToken)
                .build();
    }

}