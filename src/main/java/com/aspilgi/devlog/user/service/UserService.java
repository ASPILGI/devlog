package com.aspilgi.devlog.user.service;

import com.aspilgi.devlog.user.dto.*;

public interface UserService {

    UserResponse signUp(UserSignupRequest request);

    UserMeResponse me(Long userId);
}
