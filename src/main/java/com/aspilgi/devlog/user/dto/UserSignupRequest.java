package com.aspilgi.devlog.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserSignupRequest {

    @NotBlank
    @Size(min = 4, max = 20, message = "아이디는 4~20자로 입력해주세요.")
    private String loginId;

    @NotBlank
    @Size(min = 4, max = 20, message = "비밀번호는 8~20자로 입력해주세요.")
    private String password;

    @NotBlank
    @Size(min = 4, max = 20, message = "닉네임은 2~20자로 입력해주세요.")
    private String nickname;

    @Email
    @NotBlank
    private String email;
}
