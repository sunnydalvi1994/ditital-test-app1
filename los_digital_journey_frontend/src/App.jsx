import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import DealerInvoice from './pages/DealerInvoice';
import DealerInvoiceRouter from './pages/DealerInvoiceRouter';
import { ToastContainer } from 'react-toastify';
import theme from './theme/theme';
import './styles/customToast.css';
import NonIndividualPersonalDetails from './pages/forms/NonIndividualPersonalDetails';

const HomePage = lazy(() => import('./pages/HomePage'));
const MultiLoanFormPage = lazy(() => import('./pages/MultiLoanFormPage'));
const DocumentVerification = lazy(() => import('./pages/DocumentVerification'));
const SanctionLetter = lazy(() => import('./pages/SanctionLetter'));
const ThankYou = lazy(() => import('./pages/ThankYou'));

export default function App() {
  return (
    <div className="app-root">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apply/:loanType/:subtype/*" element={<MultiLoanFormPage />} />
              <Route path="/documentsVerification" element={<DocumentVerification />} />
              <Route path="/dealer-invoice" element={<DealerInvoiceRouter />} />
              <Route path="/apply/:loanType/:subtype/sanction" element={<SanctionLetter />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
          </Suspense>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
          <Footer />
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
}
