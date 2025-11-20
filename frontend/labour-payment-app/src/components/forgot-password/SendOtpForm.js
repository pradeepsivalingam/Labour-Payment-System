import React, { useState } from 'react';
import './FormStyles.css';

const SendOtpForm = ({ onNext }) => {
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contact.trim()) {
      // Normally call backend API here to send OTP
      onNext(contact);
    }
  };

  return (
    <form className="form-box" onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>
      <p>Enter your registered email or mobile number</p>
      <input
        type="text"
        placeholder="Email or Mobile"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        required
      />
      <button type="submit">Send OTP</button>
    </form>
  );
};

export default SendOtpForm;
