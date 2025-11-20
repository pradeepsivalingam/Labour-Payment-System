package com.labour.labour_payment.service;

import com.labour.labour_payment.model.User;
import com.labour.labour_payment.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<User> getAllSupervisors() {
    return userRepository.findByUserTypeIgnoreCase("SUPERVISOR");
  }

  public User save(User user) {
    return userRepository.save(user);
  }
}
