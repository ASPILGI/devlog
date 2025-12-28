package com.aspilgi.devlog.user.service;

import com.aspilgi.devlog.auth.jwt.JwtProperties;
import com.aspilgi.devlog.auth.jwt.JwtTokenProvider;
import com.aspilgi.devlog.auth.refresh.repository.RefreshTokenRepository;
import com.aspilgi.devlog.user.dto.*;
import com.aspilgi.devlog.user.entity.User;
import com.aspilgi.devlog.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    @Override
    public UserResponse signUp(UserSignupRequest request) {

        // 1. 이메일, ID 중복체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("이미 사용 중인 ID입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(request.getPassword());

        // 3. User 엔터티 생성
        User user = User.builder()
                .loginId(request.getLoginId())
                .email(request.getEmail())
                .password(encodedPw)
                .nickname(request.getNickname())
                .build();

        User saved = userRepository.save(user);

        // 4. 응답 DTO 변환
        return UserResponse.builder()
                .id(saved.getId())
                .loginId(request.getLoginId())
                .email(saved.getEmail())
                .nickname(saved.getNickname())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserMeResponse me(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        return UserMeResponse.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
