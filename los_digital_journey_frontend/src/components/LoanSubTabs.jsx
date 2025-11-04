import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function LoanSubTabs({ subtypes = [], selected, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Tabs
      value={selected}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ marginBottom: 3 }}
    >
      {subtypes.map((sub) => (
        <Tab key={sub} value={sub} label={sub} />
      ))}
    </Tabs>
  );
}
