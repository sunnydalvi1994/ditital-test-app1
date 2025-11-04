import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function LoanTabs({ loanTypes, selected, onChange }) {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Tabs
      value={selected}
      onChange={handleChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ marginBottom: 2 }}
    >
      {loanTypes.map((type) => (
        <Tab key={type} value={type} label={`${type} Loan`} />
      ))}
    </Tabs>
  );
}
