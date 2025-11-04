import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  RadioGroup,
  Radio,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import '../../styles/components/formAndButtons.css';
// import OTPModal from '../OtpVerificationModal';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import '../../styles/components/dialogbox.css';
import { toast } from 'react-toastify';
import LoaderWrapper from '../../components/LoaderWrapper';

export default function BasicDetailsForm() {
  const { control, clearErrors, watch, setValue } = useFormContext();

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isBasicTermsOpen, setIsBasicTermsOpen] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [mobileForOTP, setMobileForOTP] = useState('');
  const [verified, setVerified] = useState(false);
  const [hasAccount, setHasAccount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const handleAccountSelection = (value) => {
    setHasAccount(value);
    setError('');
    if (value === 'yes') {
      sessionStorage.setItem('customerId', '123456789012345');
    } else {
      sessionStorage.removeItem('customerId');
    }
  };

  useEffect(() => {
    console.log('BasicDetailsForm loaded');
  }, []);

  const termsList = [
    'agreeTerms',
    'agreeConsent',
    'agreeDisclosure',
    'agreeDirectorDeclaration',
    'agreeBiometricOTP',
    'agreeEKYC'
  ];

  watch(termsList);
  const allSelected = termsList.every((term) => watch(term) === true);

  const handleSelectAll = (checked) => {
    termsList.forEach((term) => setValue(term, checked, { shouldValidate: true }));
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container">
        <Grid spacing={2}>
          <div className="section-title">About You</div>
          <br />
          {/* Account Selection */}
          <div className="account-section">
            <Box display="flex" alignItems="center" sx={{ gap: '20px', mt: 2 }}>
              <Typography variant="h4" className="account-question">
                Do you have an account with Kalolytic?
              </Typography>

              <Grid container alignItems="center" sx={{ ml: 1 }}>
                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      mr: 1,
                      fontWeight: hasAccount === 'no' ? 600 : 400,
                      color: hasAccount === 'no' ? '#555' : '#aaa'
                    }}
                  >
                    No
                  </Typography>
                </Grid>

                <Grid item>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={hasAccount === 'yes'}
                      onChange={(e) =>
                        handleAccountSelection(e.target.checked ? 'yes' : 'no')
                      }
                    />
                    <span className="slider gradient"></span>
                  </label>
                </Grid>

                <Grid item>
                  <Typography
                    variant="body1"
                    sx={{
                      ml: 1,
                      fontWeight: hasAccount === 'yes' ? 600 : 400,
                      color: hasAccount === 'yes' ? '#0d4689' : '#aaa'
                    }}
                  >
                    Yes
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {error && <Typography color="error">{error}</Typography>}
          </div>



          {/* Mobile with OTP Verification */}
          <Grid container>
            <Grid item xs={12} sm={10} md={5}>
              <Controller
  name="mobile"
  control={control}
  rules={{
    required: 'Mobile number is required',
    validate: (value) => {
      if (!value) return 'Mobile number is required';

      if (!/^[0-9]{10}$/.test(value)) {
        return 'Enter a valid 10-digit mobile number';
      }

      if (!verified) {
        return 'Please verify your mobile number';
      }

      return true;
    },
  }}
  render={({ field, fieldState }) => {
    const isValidNumber = /^[0-9]{10}$/.test(field.value);

    return (
      <div className="form-group mobile-group">
        <label>Mobile Number</label>
        <div className="mobile-input-container">
          <TextField
            variant="standard"
            fullWidth
            {...field}
            disabled={verified}
            placeholder="Enter your 10-digit mobile number"
            className="custom-textfield"
            error={!!fieldState.error}
            helperText={fieldState.error?.message || ''}
            inputProps={{
              maxLength: 10,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              field.onChange(value);
            }}
          />

          <Button
            variant="contained"
            size="small"
            onClick={() => {
              if (isValidNumber) {
                setMobileForOTP(field.value);
                sessionStorage.setItem('mobileForOTP', field.value);
                setOtpModalOpen(true);
              } else {
                alert('Please enter a valid 10-digit mobile number');
              }
            }}
            disabled={verified || !isValidNumber}
            className={`verify-btn ${!isValidNumber && !verified ? 'disabled-initial' : ''}`}
          >
            {verified ? '✓ Verified' : 'Verify'}
          </Button>
        </div>
      </div>
    );
  }}
/>


              {/* OTP Modal */}
              <OtpVerificationModal
                open={otpModalOpen}
                mobileNumber={mobileForOTP}
                onClose={() => setOtpModalOpen(false)}
                onVerify={() => {
                  setVerified(true);
                  clearErrors('mobile');
                  setOtpModalOpen(false);
                  toast.success('📱 Mobile number verified!', {
                    autoClose: 2000,
                    position: 'bottom-right'
                  });
                }}
                onResend={() => {
                  toast.info('OTP resent successfully!', {
                    autoClose: 2000,
                    position: 'bottom-right'
                  });
                }}
              />
            </Grid>
          </Grid>
          <div className="consent-section" style={{ marginTop: '50px' }}>
            <div className=" consent-title">Consent</div>
            {/* Select All Terms */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="selectAllCheck"
                  />
                }
                label={
                  <span className="checkbox-label">
                    <strong>Select All </strong>
                  </span>
                }
              />
            </Grid>

            {/* Terms checkboxes */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="agreeTerms"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={watch('agreeTerms') || false} // ✅ ensure it follows the watched value
                      />
                    )}
                  />
                }
                label={
                  <span className={`checkbox-label ${watch('agreeTerms') ? 'checked' : ''}`}>
                    By continuing you agree to Kalolytic Lending's T&Cs and Privacy Policy.
                  </span>
                }
                onClick={() => setIsBasicTermsOpen(true)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="agreeConsent"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={watch('agreeConsent') || false} // ✅ ensure it follows the watched value
                      />
                    )}
                  />
                }
                label={
                  <span className={`checkbox-label ${watch('agreeConsent') ? 'checked' : ''}`}>
                    I agree to give consent to collect, use, store and share your information.
                  </span>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="agreeDisclosure"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={watch('agreeDisclosure') || false} // ✅ ensure it follows the watched value
                      />
                    )}
                  />
                }
                label={
                  <span className={`checkbox-label ${watch('agreeDisclosure') ? 'checked' : ''}`}>
                    I/We hereby furnish my consent to Kalolytic to share and/or fetch any of my/our
                    information <a>Read More...</a>
                  </span>
                }
                onClick={() => setIsTermsModalOpen(true)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="agreeDirectorDeclaration"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={watch('agreeDirectorDeclaration') || false} // ✅ ensure it follows the watched value
                      />
                    )}
                  />
                }
                label={
                  <span
                    className={`checkbox-label ${watch('agreeDirectorDeclaration') ? 'checked' : ''}`}
                  >
                    I declare that I am not a director/relative of director of Kalolytic/any other
                    bank. <a>Read More...</a>
                  </span>
                }
                onClick={() => setIsDirectorModalOpen(true)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="agreeBiometricOTP"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={watch('agreeBiometricOTP') || false} // ✅ ensure it follows the watched value
                      />
                    )}
                  />
                }
                label={
                  <span className={`checkbox-label ${watch('agreeBiometricOTP') ? 'checked' : ''}`}>
                    I/We agree to provide biometric scan or OTP for KYC.
                  </span>
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="agreeEKYC"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={watch('agreeEKYC') || false} // ✅ ensure it follows the watched value
                      />
                    )}
                  />
                }
                label={
                  <span className={`checkbox-label ${watch('agreeEKYC') ? 'checked' : ''}`}>
                    I/We have no objection for Kalolytic for downloading, validating, storing,
                    sharing my KYC details.
                  </span>
                }
              />
            </Grid>
          </div>
        </Grid>

        {/* All Modals */}
        <TermsModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
          onAgree={() => setIsTermsModalOpen(false)}
        />
        <BasicTermsModal
          isOpen={isBasicTermsOpen}
          onClose={() => setIsBasicTermsOpen(false)}
          onAgree={() => setIsBasicTermsOpen(false)}
        />
        <DirectorTermsModal
          isOpen={isDirectorModalOpen}
          onClose={() => setIsDirectorModalOpen(false)}
          onAgree={() => setIsDirectorModalOpen(false)}
        />
      </div>
    </LoaderWrapper>
  );
}

export function TermsModal({ isOpen, onClose, onAgree }) {
  return (
    <Dialog className="custom-dialog-main" open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="dialog-title">Terms & Conditions</DialogTitle>

      <DialogContent className="dialog-content">
        {/* Section 1 */}
        <Typography className="dialog-heading">1. Consent for Disclosure of Information</Typography>
        <Typography component="p" className="dialog-body">
          I/We hereby furnish my consent to Kalolytic to share and/or fetch any of my/our
          information (including my/our sensitive personal information, location etc.) or any other
          device information when Kalolytic considers such disclosure/fetching as necessary, with/
          from:
        </Typography>
        <div className="terms-list">
          <Typography component="p">
            <strong>a)</strong> Agents of Kalolytic in any jurisdiction;
          </Typography>
          <Typography component="p">
            <strong>b)</strong> Auditors, credit rating agencies/credit bureaus,
            statutory/regulatory authorities, governmental/administrative authorities, Central Know
            Your Customer (C-KYC) registry or SEBI Know Your Client registration agency, having
            jurisdiction over Kalolytic;
          </Typography>
          <Typography component="p">
            <strong>c)</strong> Service providers, professional advisors, consultants or such
            persons with whom Kalolytic contracts or proposes to contract (Collectively referred to
            as "Permitted Persons").
          </Typography>
        </div>

        <Typography className="dialog-body">
          <strong>For the purpose of:</strong>
        </Typography>
        <div className="terms-list">
          <Typography component="p">
            <strong>a)</strong> Provision of the facility, completion of onboarding formalities and
            servicing;
          </Typography>
          <Typography component="p">
            <strong>b)</strong> Complying with KYC / customer due diligence requirements, anti-money
            laundering checks;
          </Typography>
          <Typography component="p">
            <strong>c)</strong> Compliance with applicable laws or any order (judicial or
            otherwise), statutory/regulatory/legal requirement, including disclosure to information
            utilities;
          </Typography>
          <Typography component="p">
            <strong>d)</strong> Credit review of facilities availed;
          </Typography>
          <Typography component="p">
            <strong>e)</strong> Authentication or verification;
          </Typography>
          <Typography component="p">
            <strong>f)</strong> Research or analysis, credit reporting & scoring, risk management,
            participation in any service-related communication;
          </Typography>
          <Typography component="p">
            <strong>g)</strong> Electronic clearing network and for use or processing of the said
            information/data;
          </Typography>
          <Typography component="p">
            <strong>h)</strong> Disclosing any default in payment;
          </Typography>
          <Typography component="p">
            <strong>i)</strong> Recovering the credit facilities including all interest and other
            charges.
          </Typography>
        </div>

        {/* Section 2 */}
        <Typography className="dialog-heading">2. Consent for Camera/Microphone Access</Typography>
        <Typography component="p" className="dialog-body">
          I/We hereby authorize Kalolytic to get a one-time access to my/our device's camera and
          microphone for the purposes of onboarding and KYC verification which is required to be
          conducted to enable Kalolytic to provide the credit facilities sought by me/us.
        </Typography>

        {/* Section 3 */}
        <Typography className="dialog-heading">
          3. Consent to Kalolytic's Privacy Commitment
        </Typography>
        <Typography component="p" className="dialog-body">
          I/We confirm having read and understood Kalolytic's 'Privacy Commitment' available at{' '}
          <a href="https://kalolytic.com/privacy-policy" target="_blank" rel="noopener noreferrer">
            https://kalolytic.com/privacy-policy
          </a>
          . I/We acknowledge that the same shall be subject to changes by Kalolytic from time to
          time at its sole discretion and I/we agree to keep myself/ourselves updated with the same.
        </Typography>

        {/* Section 4 */}
        <Typography className="dialog-heading">4. Service Provider Authorization</Typography>
        <Typography component="p" className="dialog-body">
          I authorise Kalolytic to disclose such information provided by me to its service providers
          to enable them to contact me for rendering assistance that may be required to submit
          application to Kalolytic and complete onboarding formalities.
        </Typography>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onAgree} variant="contained" className="verify-btn">
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function BasicTermsModal({ isOpen, onClose, onAgree }) {
  return (
    <Dialog className="custom-dialog-main" open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="dialog-title">Kalolytic Lending Terms & Conditions</DialogTitle>

      <DialogContent className="dialog-content">
        {/* Section 1 */}
        <Typography className="dialog-heading">1. General Terms</Typography>
        <Typography className="dialog-body">
          By proceeding with this loan application, you agree to be bound by the terms and
          conditions of Kalolytic.
        </Typography>

        {/* Section 2 */}
        <Typography className="dialog-heading">2. Application Processing</Typography>
        <Typography className="dialog-body">
          • The Bank reserves the right to approve or reject any loan application at its sole
          discretion.
        </Typography>
        <Typography className="dialog-body">
          • Processing fees, if applicable, are non-refundable even if the loan is not approved.
        </Typography>
        <Typography className="dialog-body">
          • All documents provided must be genuine and accurate.
        </Typography>

        {/* Section 3 */}
        <Typography className="dialog-heading">3. Interest Rates and Charges</Typography>
        <Typography className="dialog-body">
          • Interest rates are subject to change based on Bank's policies and RBI guidelines.
        </Typography>
        <Typography className="dialog-body">
          • Additional charges may apply as per the Bank's schedule of charges.
        </Typography>
        <Typography className="dialog-body">
          • Any changes in interest rates will be communicated as per regulatory requirements.
        </Typography>

        {/* Section 4 */}
        <Typography className="dialog-heading">4. Repayment Terms</Typography>
        <Typography className="dialog-body">
          • EMIs must be paid on the specified due dates.
        </Typography>
        <Typography className="dialog-body">
          • Late payment charges will apply for delayed payments.
        </Typography>
        <Typography className="dialog-body">
          • Prepayment charges may apply as per the loan agreement.
        </Typography>

        {/* Section 5 */}
        <Typography className="dialog-heading">5. Privacy Policy</Typography>
        <Typography className="dialog-body">
          • Your personal information will be handled in accordance with our Privacy Policy.
        </Typography>
        <Typography className="dialog-body">
          • Information may be shared with credit bureaus and regulatory authorities as required.
        </Typography>
        <Typography className="dialog-body">
          • We may use your contact information for loan-related communications.
        </Typography>

        {/* Section 6 */}
        <Typography className="dialog-heading">6. Legal Compliance</Typography>
        <Typography className="dialog-body">
          • This agreement is governed by Indian laws and regulations.
        </Typography>
        <Typography className="dialog-body">
          • Any disputes will be subject to the jurisdiction of competent courts.
        </Typography>
        <Typography className="dialog-body">
          • The Bank complies with all RBI guidelines and banking regulations.
        </Typography>

        <Typography className="dialog-body" sx={{ fontWeight: 600 }}>
          By clicking "I Agree", you acknowledge that you have read, understood, and agree to these
          Terms & Conditions and Privacy Policy.
        </Typography>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onAgree} variant="contained" className="verify-btn">
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function DirectorTermsModal({ isOpen, onClose, onAgree }) {
  return (
    <Dialog className="custom-dialog-main" open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="dialog-title">Director Declaration</DialogTitle>

      <DialogContent className="dialog-content">
        <Typography className="dialog-heading">Declaration of Independence</Typography>

        <Typography className="dialog-body">I/We hereby declare and confirm that:</Typography>

        <div className="terms-list">
          <Typography className="dialog-body" component="p">
            <strong>1.</strong> I am not a director, relative of a director, or senior official of
            Kalolytic.
          </Typography>
          <Typography className="dialog-body" component="p">
            <strong>2.</strong> I am not a director, relative of a director, or senior official of
            any other bank.
          </Typography>
          <Typography className="dialog-body" component="p">
            <strong>3.</strong> I do not hold any position that could create a conflict of interest
            with this loan application.
          </Typography>
          <Typography className="dialog-body" component="p">
            <strong>4.</strong> All information provided in this application is true and accurate to
            the best of my knowledge.
          </Typography>
          <Typography className="dialog-body" component="p">
            <strong>5.</strong> I understand that providing false information may result in
            rejection of this application and/or legal action.
          </Typography>
        </div>

        <Typography className="dialog-body" sx={{ mt: 2, fontWeight: 600 }}>
          <strong>Note:</strong> This declaration is mandatory as per banking regulations and
          internal policies of Kalolytic.
        </Typography>
      </DialogContent>

      <DialogActions className="dialog-actions">
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onAgree} variant="contained" className="verify-btn">
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
