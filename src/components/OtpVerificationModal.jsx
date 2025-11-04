// src/components/OtpVerificationModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/otpModal.css';

export default function OtpVerificationModal({ open, mobileNumber, onClose, onVerify, onResend }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60); // 2 min
  const inputsRef = useRef([]);

  // Handle timer countdown
  useEffect(() => {
    if (!open) return;
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  // Handle OTP input
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    onVerify(otp.join(''));
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    inputsRef.current[0].focus();
    setTimer(60);
    onResend();
  };

  if (!open) return null;

  return (
      <div className="otp-modal">
        <div className="otp-modal-content">
          <div className="otp-header">
            <h3>📱 Mobile Verification</h3>
            <span className="close-otp" onClick={onClose}>
              &times;
            </span>
          </div>

          <div className="otp-body">
            <p>
              Enter the 6-digit OTP sent to <strong>{mobileNumber}</strong>
            </p>

            <div className="otp-input-container">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  className="otp-digit"
                  value={digit}
                  ref={(el) => (inputsRef.current[i] = el)}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>

            <div className="otp-timer">
              <span>
                {String(Math.floor(timer / 60)).padStart(2, '0')}:
                {String(timer % 60).padStart(2, '0')}
              </span>
              <button className="resend-otp-btn" onClick={handleResend} disabled={timer > 0}>
                Resend OTP
              </button>
            </div>

            <div className="otp-actions">
              <button className="cancel-otp-btn" onClick={onClose}>
                Cancel
              </button>
              <button className="verify-otp-btn" onClick={handleVerify}>
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
