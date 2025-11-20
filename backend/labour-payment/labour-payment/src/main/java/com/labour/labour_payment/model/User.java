package com.labour.labour_payment.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_type", nullable = false)
  private String userType;

  @Column(nullable = false, unique = true)
  private String username;  // user ID like in your form

  @Column(nullable = false)
  private String password;

  @Column(nullable = false, unique = true)
  private String contact; // Mobile or Email

  // Constructors, getters, setters

  public User() {}

  public User(String userType, String username, String password, String contact) {
    this.userType = userType;
    this.username = username;
    this.password = password;
    this.contact = contact;
  }

  public String getUsername() {
    return username;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUserType() {
    return userType;
  }

  public String getPassword() {
    return password;
  }

  public String getContact() {
    return contact;
  }

  public void setUserType(String userType) { this.userType = userType; }

  public void setUsername(String username) { this.username = username; }

  public void setPassword(String password) { this.password = password; }

  public void setContact(String contact) { this.contact = contact; }
}
