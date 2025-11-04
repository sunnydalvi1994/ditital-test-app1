import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/components/footer.css';

export default function Footer() {
  return (
    <Box component="footer" className="footer">
      <Typography variant="body2">
        Powered by <strong className='footer-title'>Kalolytic</strong>
      </Typography>
    </Box>
  );
}
