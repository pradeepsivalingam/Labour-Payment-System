import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';

const ResetPassword = ({ contactInfo }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Normally you'd call your backend here to save the new password
    alert('Password reset successfully!');
    navigate('/'); // Redirect to login page
  };

  return (
    <form className="form-box" onSubmit={handleReset}>
      <h2>Reset Password</h2>
      <p>Set a new password for {contactInfo}</p>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;
