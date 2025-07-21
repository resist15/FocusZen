package com.focuszen.controllers;

import com.focuszen.dto.AuthenticationRequest;
import com.focuszen.dto.AuthenticationResponse;
import com.focuszen.utils.JwtUtil;
import com.focuszen.services.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request) {
        var authToken = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        authManager.authenticate(authToken);

        var userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        return new AuthenticationResponse(jwt);
    }
}
