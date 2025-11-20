import React, { useState } from 'react';
import SendOtpForm from './SendOtpForm';
import OtpVerification from './OtpVerificationForm';
import ResetPassword from './ResetPasswordForm';
import'./FormStyles.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState('');

  return (
    <div className="form-container">
      {step === 1 && (
        <SendOtpForm
          onNext={(info) => {
            setContactInfo(info);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <OtpVerification
          contactInfo={contactInfo}
          onVerified={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ResetPassword
          contactInfo={contactInfo}
          onComplete={() => alert('Password reset successfully!')}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
