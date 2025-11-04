import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../styles/thankYou.css';

const ThankYou = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    // Simple confetti using DOM elements
    const colors = ['#3a76b9', '#0d4689', '#2ecc71', '#f39c12', '#e74c3c'];
    for (let i = 0; i < 60; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      document.body.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }
  }, []);

  // ✅ Handle navigation
  const handleStartNew = () => {
    navigate('/'); // Redirect to homepage
  };

  return (
    <Box className="thankyou-container">
      <Box className="thankyou-card">

        {/* Tick Icon */}
        <CheckCircleIcon className="thankyou-icon animate-tick" />

        {/* Thank You Title */}
        <h1 className="thankyou-animated-text">
          <span>Thank</span> <span>You!</span>
        </h1>

        {/* Submission Info */}
        <Box className="thankyou-section animate-section">
          <Typography variant="body1" className="thankyou-text">
            Your loan application has been successfully submitted.<br />
            You will receive a confirmation email shortly with your application reference number.
          </Typography>
        </Box>

        {/* Next Steps */}
        <Box className="thankyou-section animate-section delay-1">
          <Typography variant="h6" className="steps-title">Next Steps:</Typography>
          <ul>
            <li>Our team will review your application within 24 hours</li>
            <li>You will be contacted for any additional documentation</li>
            <li>Final approval will be communicated via email and SMS</li>
          </ul>
        </Box>

        {/* Reference Details */}
        <Box className="thankyou-section animate-section delay-2">
          <Typography><strong>Reference Number:</strong> LA2025082901</Typography>
          <Typography><strong>Application Date:</strong> 13/10/2025</Typography>
        </Box>

        {/* Action Buttons */}
        <Box className="thankyou-actions animate-section delay-3">
          {/* ✅ Added onClick for navigation */}
          <Button 
            variant="contained" 
            className="thankyou-btn primary"
            onClick={handleStartNew}
          >
            Start New Application
          </Button>
          
          <Button variant="contained" className="thankyou-btn secondary">
            Download IPA Letter
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ThankYou;
