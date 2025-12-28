package com.aspilgi.devlog.auth.service;

import com.aspilgi.devlog.user.dto.UserLoginRequest;
import com.aspilgi.devlog.user.dto.UserLoginResponse;
import com.aspilgi.devlog.user.dto.UserReissueRequest;
import com.aspilgi.devlog.user.dto.UserReissueResponse;

public interface AuthService {
    UserLoginResponse login(UserLoginRequest request);

    UserReissueResponse reissue(UserReissueRequest request);

    void logout(String authorizationHeader);
}
