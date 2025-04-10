package com.example.driveme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.driveme.model.*;
import com.example.driveme.DTO.*;
import com.example.driveme.JwtAuth.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtServices jwtService;
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
    
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtServices jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/user/signup")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO registerUserDto) {
        logger.info("Registering user: " + registerUserDto.getFullName() + " with email: " + registerUserDto.getEmail());
        User registeredUser = authenticationService.signup(registerUserDto);
    
        
        RegisterResponseDTO registerResponse = new RegisterResponseDTO()
                .setId(registeredUser.getId())
                .setFullName(registeredUser.getFullName())
                .setEmail(registeredUser.getEmail())
                .setPhone(registeredUser.getPhone())
                .setAadharCard(registeredUser.getAadharCard());
        logger.info("User registered successfully: " + registerResponse.getFullName() + " with email: " + registerResponse.getEmail());
        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/driver/signup")
    public ResponseEntity<RegisterResponseDTO> registerDriver(@RequestBody RegisterRequestDTO registerUserDto) {
        Driver registeredDriver = authenticationService.signupDriver(registerUserDto);

        RegisterResponseDTO registerResponse = new RegisterResponseDTO()
                .setId(registeredDriver.getDriver_id())
                .setFullName(registeredDriver.getName())
                .setEmail(registeredDriver.getEmail())
                .setPhone(registeredDriver.getPhone())
                .setAadharCard(registeredDriver.getAadhar_card());


        return ResponseEntity.ok(registerResponse);
    }

    @PostMapping("/user/login")
    public ResponseEntity<LoginResponseDTO> authenticate(@RequestBody LoginRequestDTO loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponseDTO loginResponse = new LoginResponseDTO().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/driver/login")
    public ResponseEntity<LoginResponseDTO> authenticateDriver(@RequestBody LoginRequestDTO loginUserDto) {
        Driver authenticatedDriver = authenticationService.authenticateDriver(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedDriver);

        LoginResponseDTO loginResponse = new LoginResponseDTO().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

        return ResponseEntity.ok(loginResponse);
    }
}