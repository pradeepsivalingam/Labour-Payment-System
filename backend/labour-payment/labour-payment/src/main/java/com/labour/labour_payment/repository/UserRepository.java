package com.labour.labour_payment.repository;

import com.labour.labour_payment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByUserTypeIgnoreCase(String userType);
}
