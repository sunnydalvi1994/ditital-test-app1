import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import '../styles/components/loader.css';

export default function LoaderWrapper({ loading: externalLoading, children, delay = 100 }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof externalLoading === 'boolean') {
      setLoading(externalLoading);
    } else {
      const timer = setTimeout(() => setLoading(false), delay);
      return () => clearTimeout(timer);
    }
  }, [externalLoading, delay]);

  if (loading) {
    return (
      <Box className="loader-box">
        <CircularProgress size={60} thickness={4} sx={{}} className="loader-progress" />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  return <>{children}</>;
}
