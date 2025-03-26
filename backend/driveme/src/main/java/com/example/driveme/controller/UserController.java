package com.example.driveme.controller;

import com.example.driveme.model.User;
import com.example.driveme.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) { // Constructor-based Injection
        this.userRepository = userRepository;
    }

    @GetMapping("/{full_name}")
    public ResponseEntity<User> getUserByFullName(@PathVariable("full_name") String full_name) {
        return userRepository.findByFullName(full_name)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestBody User user) {
        boolean isValidUser = userRepository.findByFullName(user.getFullName()).stream()
            .anyMatch(u -> u.getPasswordHash().equals(user.getPasswordHash()));

        if (isValidUser) {
            return ResponseEntity.ok("User Logged In");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
    }

    @PostMapping("/{full_name}/add-vehicle")
    public ResponseEntity<User> addVehicle(@PathVariable("full_name") String full_name, @RequestBody User user) {
        return userRepository.findByFullName(full_name)
            .map(u -> {
                u.getVehicles().addAll(user.getVehicles());
                return ResponseEntity.ok(userRepository.save(u));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}