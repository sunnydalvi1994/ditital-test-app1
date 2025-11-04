import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import handleVAPT from '../../utils/globalValidation.js';
import '../../styles/components/formAndButtons.css';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import LoaderWrapper from '../../components/LoaderWrapper';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function BasicDetailsFormTwo() {
  const { control, trigger, setValue, formState, getValues } = useFormContext();

  const [emailOtpModalOpen, setEmailOtpModalOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('aadhar');
  const [kycVerified, setKycVerified] = useState(false);
  const [kycOtpModalOpen, setKycOtpModalOpen] = useState(false);
  const [kycNumberValue, setKycNumberValue] = useState('');
  const [loading, setLoading] = useState(true);

  const mobileForOTP = sessionStorage.getItem('mobileForOTP');

  // ---------------------------
  // Debounce logic for KYC validation
  // ---------------------------
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedTrigger = useRef(
    debounce((value) => {
      setKycNumberValue(value);
      trigger('kycNumber');
    }, 300)
  ).current;

  // ---------------------------
  // Memoized validity check
  // ---------------------------
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

  // ---------------------------
  // Store fullName in sessionStorage without causing rerenders
  // ---------------------------
  useEffect(() => {
    const fullName = getValues('fullName');
    if (fullName) sessionStorage.setItem('fullName', fullName);
  }, []);

  // ---------------------------
  // Handlers
  // ---------------------------
  const handleEmailVerify = useCallback(
    (otp) => {
      console.log('Entered Email OTP:', otp);
      setEmailVerified(true);
      setEmailOtpModalOpen(false);

      setValue('kycVerified', true, { shouldValidate: true });
      trigger('kycNumber');
    },
    [setValue, trigger]
  );

  const handleKycVerify = useCallback(() => {
    setKycVerified(true);
    setKycOtpModalOpen(false);
    setValue('kycVerified', true, { shouldValidate: true });
    trigger('kycNumber');
  }, [setValue, trigger]);

  const handleKycChange = useCallback(
    (e, fieldOnChange) => {
      fieldOnChange(e);
      setKycVerified(false);
      debouncedTrigger(e.target.value);
    },
    [debouncedTrigger]
  );

  const handleDocChange = useCallback(
    (e, fieldOnChange) => {
      fieldOnChange(e);
      setSelectedDoc(e.target.value);
      setKycVerified(false);
      setValue('kycNumber', '');
    },
    [setValue]
  );

  // ---------------------------
  // Render
  // ---------------------------
  // useEffect(() => {
  //   console.log('useeffect.......');
  // });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container">
        <Grid container spacing={2} direction="column">
          <div className="section-title">About You</div>
          <br />

          {/* Full Name */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: 'Full Name is required',
                validate: (value) => {
                  if (!value) return true;

                  // 1️⃣ Allow only alphabets and spaces
                  const regex = /^[A-Za-z ]+$/;
                  if (!regex.test(value)) {
                    return 'Only alphabets and spaces are allowed';
                  }

                  // 2️⃣ Prevent consecutive spaces
                  if (/\s{2,}/.test(value)) {
                    return 'Multiple consecutive spaces are not allowed';
                  }

                  // 3️⃣ Prevent only spaces
                  if (/^\s+$/.test(value)) {
                    return 'Name cannot contain only spaces';
                  }

                  // 4️⃣ Length check (optional but recommended)
                  if (value.length < 2) {
                    return 'Name must be at least 2 characters long';
                  }
                  if (value.length > 50) {
                    return 'Name cannot exceed 50 characters';
                  }

                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Full Name</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    placeholder="Enter your full name"
                    className="custom-textfield"
                    onChange={(e) => {
                      // ✅ Block invalid characters as user types
                      const value = e.target.value.replace(/[^A-Za-z ]/g, '');
                      field.onChange(value);
                    }}
                  />
                  {fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>
          {/* PAN Number */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="panNumber"
              control={control}
              rules={{
                required: 'PAN Number is required',
                validate: (value) => {
                  if (!value) return true;

                  // PAN must match pattern: 5 letters + 4 digits + 1 letter
                  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

                  if (!regex.test(value)) {
                    return 'Invalid PAN format (e.g., ABCDE1234F)';
                  }

                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>PAN Number</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    placeholder="Enter your PAN number"
                    className="custom-textfield"
                    inputProps={{ maxLength: 10 }}
                    onChange={(e) => {
                      // ✅ Force uppercase and remove invalid characters
                      let value = e.target.value.toUpperCase();
                      // Allow only letters and digits
                      value = value.replace(/[^A-Z0-9]/g, '');
                      field.onChange(value);
                    }}
                  />
                  {fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>
          {/* DOB */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="dob"
              control={control}
              rules={{
                required: 'Date of Birth is required',
                validate: (value) => {
                  if (!value) return 'Date of Birth is required';

                  const dob = dayjs(value);
                  if (!dob.isValid()) return 'Invalid Date of Birth';

                  const today = dayjs();
                  const age = today.diff(dob, 'year');

                  // ❌ Future date check
                  if (dob.isAfter(today)) {
                    return 'Date of Birth cannot be in the future';
                  }

                  // ❌ Minimum age check (must be at least 18)
                  if (age < 18) {
                    return 'You must be at least 18 years old';
                  }

                  // ❌ Maximum age check (must not exceed 60)
                  if (age > 60) {
                    return 'Users above 60 years are not eligible';
                  }

                  // ✅ Fallback to your existing VAPT validation logic
                  const fakeEvent = { target: { value: dob.format('YYYY-MM-DD') } };
                  const message = handleVAPT(fakeEvent, 'DOB', '', 'DATE_FIELD');
                  return message === '' || message;
                },
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Date of Birth</label>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={field.value || null}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                        field.onBlur();
                      }}
                      disableFuture
                      minDate={dayjs().subtract(60, 'year')} // 🚫 older than 60 years disabled
                      maxDate={dayjs().subtract(18, 'year')} // 🚫 younger than 18 disabled
                      slotProps={{
                        textField: {
                          variant: 'standard',
                          fullWidth: true,
                          className: 'custom-textfield',
                          error: !!fieldState.error,
                          placeholder: 'Select your Date of Birth',
                        },
                      }}
                    />
                  </LocalizationProvider>

                  {fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>


          {/* Email */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                validate: (value) => {
                  if (!value) return true;
                  const fakeEvent = { target: { value } };
                  const message = handleVAPT(fakeEvent, 'EMAIL', '', 'EMAIL_FIELD');
                  return message === '' || message;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group mobile-group">
                  <label>Email</label>
                  <div className="mobile-input-container">
                    {/* <input
                    type="email"
                    {...field}
                    placeholder="Enter your email"
                    disabled={emailVerified}
                  /> */}
                    <TextField
                      type="email"
                      variant="standard" // ✅ works here
                      fullWidth
                      {...field}
                      placeholder="Enter your email"
                      disabled={emailVerified}
                      className="custom-textfield"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setEmailOtpModalOpen(true);
                        setEmailForOTP(field.value);
                      }}
                      disabled={
                        emailVerified ||
                        !(field.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))
                      }
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
              onVerify={handleEmailVerify}
              onResend={() => console.log('Email OTP Resent to', emailForOTP)}
            />
          </Grid>

          {/* KYC Select + Verify */}
          <Grid item size={{ xs: 12, sm: 8, md: 6 }}>
            <Controller
              name="kycDocument"
              control={control}
              defaultValue="aadhar"
              rules={{ required: 'KYC Document is required' }}
              render={({ field, fieldState }) => (
                <div className="form-group plain-input-group">
                  <label>Select KYC Document</label>
                  <select
                    {...field}
                    onChange={(e) => handleDocChange(e, field.onChange)}
                    className="plain-select"
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
                  <div className="form-group plain-input-group" style={{ marginTop: '10px' }}>
                    <label>Enter {selectedDoc.replace('_', ' ').toUpperCase()} Number</label>
                    <div className="mobile-input-container">
                      <input
                        type="text"
                        {...field}
                        placeholder={`Enter your ${selectedDoc}`}
                        disabled={kycVerified}
                        onChange={(e) => handleKycChange(e, field.onChange)}
                        className="plain-input"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setKycOtpModalOpen(true)}
                        disabled={!isValid || kycVerified}
                        style={{ backgroundColor: kycVerified ? 'green' : undefined }}
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
              onVerify={handleKycVerify}
              onResend={() => console.log('OTP Resent to', mobileForOTP)}
            />
          </Grid>
        </Grid>
      </div>
    </LoaderWrapper>
  );
}
