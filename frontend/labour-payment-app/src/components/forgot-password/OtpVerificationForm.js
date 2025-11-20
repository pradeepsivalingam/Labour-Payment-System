import React, { useState } from 'react';
import './FormStyles.css';

const OtpVerification = ({ contactInfo, onVerified, onBack }) => {
  const [otp, setOtp] = useState('');

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      // Simulated OTP check
      onVerified();
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <form className="form-box" onSubmit={handleVerify}>
      <h2>OTP Verification</h2>
      <p>OTP sent to {contactInfo}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify OTP</button>
      <button type="button" className="link-button" onClick={onBack}>
        Go Back
      </button>
    </form>
  );
};

export default OtpVerification;
