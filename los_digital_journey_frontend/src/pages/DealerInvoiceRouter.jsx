import React from 'react';
import { useLocation } from 'react-router-dom';
import DealerInvoice from './DealerInvoice';
import SelectHomeInvoice from './SelectHomeInvoice';

export default function DealerInvoiceRouter() {
  const location = useLocation();
  const loanType = (location.state && location.state.loanType) || '';

  // Normalize common synonyms
  const lt = (loanType || '').toString().toLowerCase();

  if (lt === 'home') {
    return <SelectHomeInvoice />;
  }

  // Treat 'vehicle' or 'car' as dealer invoice
  if (lt === 'vehicle' || lt === 'car') {
    return <DealerInvoice />;
  }

  // Default fallback: show DealerInvoice
  return <DealerInvoice />;
}
