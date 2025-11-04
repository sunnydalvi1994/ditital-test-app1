import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Button } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import handleVAPT from '../../utils/globalValidation';
import '../../styles/components/formAndButtons.css';
import OtpVerificationModal from '../OtpVerificationModal';

export default function BasicDetailsFormTwo() {
  const { control, trigger, setValue, formState } = useFormContext();

  const [emailOtpModalOpen, setEmailOtpModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('');
  const [kycVerified, setKycVerified] = useState(false);
  const [kycOtpModalOpen, setKycOtpModalOpen] = useState(false);
  const [kycNumberValue, setKycNumberValue] = useState('');

  const mobileForOTP = sessionStorage.getItem('mobileForOTP');
  // const kycVerifiedFormState = watch('kycVerified', false);
  useEffect(() => {
    console.log('useEffect....');
  });

  // ✅ Memoized validity check so it doesn't cause re-render loops
  const isValid = useMemo(() => {
    if (!kycNumberValue || kycNumberValue.trim() === '') return false;

    return !handleVAPT(
      { target: { value: kycNumberValue } },
      selectedDoc.toUpperCase(),
      '',
      selectedDoc === 'aadhar'
        ? 'AADHAR'
        : selectedDoc === 'pan_card'
          ? 'PAN'
          : selectedDoc.toUpperCase()
    );
  }, [kycNumberValue, selectedDoc]);

  return (
    <div className="form-container">
      <Grid spacing={2}>
        <div className="section-title">About You</div>
        <br />

        {/* Full Name */}
        <Grid item sx={{ width: '100%' }} xs={12}>
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: 'Full Name is required',
              validate: (value) => {
                if (!value) return true; // required will catch empty
                const fakeEvent = { target: { value } };
                const message = handleVAPT(fakeEvent, 'NAME', '', 'ALPHABET');
                return message === '' || message;
              }
            }}
            render={({ field, fieldState }) => (
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" {...field} placeholder="Enter your full name" />
                {field.value && sessionStorage.setItem('fullName', field.value)}
                {fieldState.error && formState.touchedFields[field.name] && (
                  <span className="error">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />
        </Grid>

        {/* PAN Number (no verify button) */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Controller
            name="panNumber"
            control={control}
            rules={{
              required: 'PAN is required',
              validate: (value) => {
                if (!value) return true; // required handles empty
                const fakeEvent = { target: { value } };
                const message = handleVAPT(fakeEvent, 'PAN', '', 'TEXT_FIELD');
                return message === '' || message;
              }
            }}
            render={({ field, fieldState }) => (
              <div className="form-group">
                <label>PAN Number</label>
                <input type="text" {...field} placeholder="Enter your PAN number" />
                {fieldState.error && formState.touchedFields[field.name] && (
                  <span className="error">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />
        </Grid>

        {/* DOB */}
        <Grid item xs={6}>
          <Controller
            name="dob"
            control={control}
            rules={{
              required: 'Date of Birth is required',
              validate: (value) => {
                if (!value) return true;
                const fakeEvent = { target: { value } };
                const message = handleVAPT(fakeEvent, 'DOB', '', 'DATE_FIELD');
                return message === '' || message;
              }
            }}
            render={({ field, fieldState }) => (
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  {...field}
                  max={new Date().toISOString().split('T')[0]} // prevent future dates
                />
                {fieldState.error && formState.touchedFields[field.name] && (
                  <span className="error">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />
        </Grid>

        {/* Email (verify optional) */}
        <Grid item xs={6}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              validate: (value) => {
                if (!value) return true; // required handles empty
                const fakeEvent = { target: { value } };
                const message = handleVAPT(fakeEvent, 'EMAIL', '', 'EMAIL_FIELD');
                return message === '' || message;
              }
            }}
            render={({ field, fieldState }) => (
              <div className="form-group mobile-group">
                <label>Email</label>
                <div className="mobile-input-container">
                  <input
                    type="email"
                    {...field}
                    placeholder="Enter your email"
                    disabled={emailVerified}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEmailOtpModalOpen(true);
                      setEmailForOTP(field.value);
                    }}
                    disabled={emailVerified}
                    className="verify-btn"
                  >
                    {emailVerified ? '✓ Verified' : 'Verify'}
                  </Button>
                </div>
                {fieldState.error && formState.touchedFields[field.name] && (
                  <span className="error">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />

          <OtpVerificationModal
            open={emailOtpModalOpen}
            mobileNumber={emailForOTP}
            onClose={() => setEmailOtpModalOpen(false)}
            onVerify={(otp) => {
              console.log('Entered Email OTP:', otp);
              setEmailVerified(true);
              setEmailOtpModalOpen(false);

              setValue('kycVerified', true, { shouldValidate: true });
              trigger('kycNumber'); // force re-validation
            }}
            onResend={() => {
              console.log('Email OTP Resent to', emailForOTP);
            }}
          />
        </Grid>

        {/* KYC Select + Verify */}
        <Grid item xs={12} sx={{ width: '100%' }}>
          <Controller
            name="kycDocument"
            control={control}
            defaultValue="aadhar"
            rules={{ required: 'KYC Document is required' }}
            render={({ field, fieldState }) => (
              <div className="form-group">
                <label>Select KYC Document</label>
                <select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedDoc(e.target.value);
                    setKycVerified(false); // Reset verify status when changing doc type
                    setValue('kycNumber', ''); // Clear value when changing document type
                  }}
                >
                  <option value="aadhar">Aadhar Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                  <option value="voter_id">Voter ID Card</option>
                  <option value="pan_card">PAN Card</option>
                </select>
                {fieldState.error && formState.touchedFields[field.name] && (
                  <span className="error">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />

          {selectedDoc && (
            <Controller
              name="kycNumber"
              control={control}
              rules={{
                required: `${selectedDoc.replace('_', ' ')} Number is required`,
                validate: (value) => {
                  if (!value || value.trim() === '') {
                    return `${selectedDoc.replace('_', ' ')} Number is required`;
                  }

                  const fakeEvent = { target: { value } };
                  return (
                    handleVAPT(
                      fakeEvent,
                      selectedDoc.toUpperCase(),
                      '',
                      selectedDoc === 'aadhar'
                        ? 'AADHAR'
                        : selectedDoc === 'pan_card'
                          ? 'PAN'
                          : selectedDoc.toUpperCase()
                    ) || true
                  );
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group mobile-group" style={{ marginTop: '10px' }}>
                  <label>Enter {selectedDoc.replace('_', ' ').toUpperCase()} Number</label>
                  <div className="mobile-input-container">
                    <input
                      type="text"
                      {...field}
                      placeholder={`Enter your ${selectedDoc}`}
                      disabled={kycVerified}
                      onChange={(e) => {
                        field.onChange(e);
                        setKycVerified(false); // Reset verify on change
                        setKycNumberValue(e.target.value); // update state for useMemo
                        trigger('kycNumber'); // Re-validate
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setKycOtpModalOpen(true)}
                      disabled={!isValid || kycVerified}
                      style={{
                        backgroundColor: kycVerified ? 'green' : undefined
                      }}
                      className={`verify-btn ${!isValid && !kycVerified ? 'disabled-initial' : ''}`}
                    >
                      {kycVerified ? '✓ Verified' : 'Verify'}
                    </Button>
                  </div>
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          )}

          <OtpVerificationModal
            open={kycOtpModalOpen}
            mobileNumber={mobileForOTP}
            onClose={() => setKycOtpModalOpen(false)}
            onVerify={() => {
              setKycVerified(true);
              setKycOtpModalOpen(false);
              setValue('kycVerified', true, { shouldValidate: true });
              trigger('kycNumber');
            }}
            onResend={() => {
              console.log('OTP Resent to', mobileForOTP);
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
