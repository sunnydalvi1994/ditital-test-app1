import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, Paper, Divider } from '@mui/material';
import '../../styles/pages/offerPage.css'; // import external CSS
import LoaderWrapper from '../../components/LoaderWrapper';
import Confetti from 'react-confetti';


export default function OfferPage() {
  function formatIndianNumber(num) {
    return num.toLocaleString('en-IN');
  }
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [interestRate] = useState(8.5);
  const [tenure, setTenure] = useState(84);
  const [emi, setEmi] = useState(0);
  const [loading, setLoading] = useState(true);

  // raw input states (to let user type freely)
  const [tenureInput, setTenureInput] = useState(String(tenure));
  const [loanAmountInput, setLoanAmountInput] = useState(formatIndianNumber(loanAmount));

  // EMI calculation function
  const calculateEMI = (principal, rate, months) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    const rateCompound = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * rateCompound) / (rateCompound - 1);
  };

  // update EMI whenever loan or tenure changes
  useEffect(() => {
    const emiValue = calculateEMI(loanAmount, interestRate, tenure);
    // smooth transition effect
    let frame;
    let start = emi;
    let end = Math.round(emiValue);
    let step = 0;
    const animate = () => {
      step++;
      const progress = Math.min(step / 15, 1); // 15 frames
      const value = Math.round(start + (end - start) * progress);
      setEmi(value);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [loanAmount, interestRate, tenure]);

  // Debounce for tenure input
  useEffect(() => {
    const handler = setTimeout(() => {
      let value = tenureInput.replace(/\D/g, '').slice(0, 2); // max 2 digits
      if (value === '') {
        setTenure(12);
        setTenureInput('12');
        return;
      }
      let num = Number(value);
      if (num < 12) num = 12;
      if (num > 84) num = 84;
      setTenure(num);
      setTenureInput(String(num));
    }, 1000);

    return () => clearTimeout(handler);
  }, [tenureInput]);
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Debounce for loan amount input
  useEffect(() => {
    const handler = setTimeout(() => {
      let value = loanAmountInput.replace(/,/g, '').replace(/\D/g, ''); // remove commas, allow only digits

      if (value === '') {
        setLoanAmount(10000);
        setLoanAmountInput('10,000');
        return;
      }

      let num = Number(value);
      if (num < 10000) num = 10000;
      if (num > 10000000) num = 10000000; // 1 crore

      setLoanAmount(num);
      setLoanAmountInput(formatIndianNumber(num)); // format with commas
    }, 1000);

    return () => clearTimeout(handler);
  }, [loanAmountInput]);

  // Formatter: Indian number format

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <Confetti
  width={window.innerWidth}
  height={window.innerHeight}
  numberOfPieces={300}
  gravity={0.3}
  recycle={false}
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999, // ensures it appears above everything
    pointerEvents: 'none' // so user can still interact
  }}
/>
      <Box className="offer-container">
        <Paper className="offer-paper" elevation={3}>
          {/* Heading */}
          <Typography variant="h4" align="center" className="offer-heading">
            Congratulations!!!
          </Typography>

          <Box className="offer-details">
            <Typography variant="body1" className="offer-description">
              Your car is available at monthly payment of
            </Typography>

            {/* EMI */}
            <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <Typography id="dynamicEMI" className="emi-text">
                Rs. {emi.toLocaleString('en-IN')} p.m.
              </Typography>
            </Box>

            {/* Tenure Section */}
            <Box className="tenure-section">
              <Typography gutterBottom className="tenure-label">
                Loan Tenure (months) <br />
                <input
                  type="text"
                  value={tenureInput}
                  onChange={(e) => setTenureInput(e.target.value)}
                  className="tenure-input"
                  maxLength={2}
                />
              </Typography>

              {/* Tenure Slider */}
              <Slider
                value={tenure}
                min={12}
                max={84}
                step={1}
                onChange={(e, val) => {
                  setTenure(val);
                  setTenureInput(String(val));
                }}
                valueLabelDisplay="auto"
                className="tenure-slider smooth-slider"
              />

              <Box className="tenure-range">
                <span>12 months</span>
                <span>84 months</span>
              </Box>

              <Box className="tenure-note">
                <Typography gutterBottom className="tenure-label">
                  Loan Amount <br />
                  <input
                    type="text"
                    value={loanAmountInput}
                    onChange={(e) => setLoanAmountInput(e.target.value)}
                    className="tenure-input"
                  />
                </Typography>
                <Typography gutterBottom className="tenure-label">
                  Rate of Interest: <br />
                  {interestRate.toFixed(2)}%
                </Typography>
              </Box>
            </Box>

            <Typography gutterBottom className="credit-score-note">
              Your credit score may fetch you BETTER Interest Rate
              <br />
              <button className="check-credit-score" color="green">
                CHECK Credit Score Now
              </button>
            </Typography>

            {/* Loan Info Section */}
            <Divider className="divider" />
            <Box className="loan-info">
              <Typography variant="body2">
                <strong>Processing Charges:</strong> Rs. 1,180
              </Typography>
              <Typography variant="body2">
                <strong>Login Fee + GST:</strong> Rs. 1,180
              </Typography>

              <Typography variant="body2" className="loan-note" sx={{ mt: 2, fontStyle: 'italic' }}>
                1. Bank will finance 90% of Ex-showroom cost + Registration + Insurance - Discounts.
                <br />
                2. The above EMI and ROI are indicative and subject to change based on Proforma
                Invoice & other documents to be provided to supplement the data provided to the
                Bank.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </LoaderWrapper>
  );
}
