package com.example.driveme.JwtAuth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.driveme.repository.UserRepository;

@Configuration
public class ApplicationConfiguration {
    private final UserRepository userRepository;
    
    public ApplicationConfiguration(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    UserDetailsService userDetailsService() {
        if (userRepository == null) {
            throw new IllegalStateException("UserRepository is not initialized");
        }
        // Check if user has used email or phone to login
        // If email, use findByEmail
        // If phone, use findByPhone
        // For now, we will just use findByEmail
        
        return username -> userRepository.findByEmail(username)
                .or(() -> userRepository.findByPhone(username))
                .or(() -> userRepository.findByFullName(username))
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }
}
