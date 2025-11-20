package com.labour.labour_payment.controller;

import com.labour.labour_payment.model.User;
import com.labour.labour_payment.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<?> getAllSupervisors() {
    List<User> supervisors = userService.getAllSupervisors();
    return ResponseEntity.ok(Map.of("data", supervisors));
  }

  @PostMapping
  public ResponseEntity<User> createUser(@RequestBody User user) {
    return ResponseEntity.ok(userService.save(user));
  }
}
