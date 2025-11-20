package com.labour.labour_payment.controller;

import com.labour.labour_payment.dto.LoginRequest;
import com.labour.labour_payment.model.User;
import com.labour.labour_payment.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // React app URL
public class AuthController {

  private final UserRepository userRepository;

  public AuthController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // POST /api/auth/login
  @PostMapping("/login")
  public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

    Optional<User> optionalUser = userRepository.findAll().stream()
      .filter(u -> u.getUsername().equals(loginRequest.getUsername())
                && u.getUserType().equalsIgnoreCase(loginRequest.getUserType()))
      .findFirst();

    if (optionalUser.isEmpty()) {
      return ResponseEntity.status(401).body("Invalid credentials");
    }

    User user = optionalUser.get();
    if (!user.getPassword().equals(loginRequest.getPassword())) {
      return ResponseEntity.status(401).body("Invalid credentials");
    }

    // Login success - you can issue token here if you add authentication system
    return ResponseEntity.ok("Login successful");
  }


}
