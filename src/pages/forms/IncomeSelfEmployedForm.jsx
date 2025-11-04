import React, { useEffect, useState } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import handleVAPT from '../../utils/globalValidation.js';
import LoaderWrapper from '../../components/LoaderWrapper';
import '../../styles/global.css';

// Indian number formatter
const formatIndianNumber = (num = '') => {
  const x = num.replace(/\D/g, '');
  return x.length > 3
    ? x.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + x.slice(-3)
    : x;
};

export default function IncomeSelfEmployedForm() {
  const { control, setValue, formState } = useFormContext();

  const [gstOtpModalOpen, setGstOtpModalOpen] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [setGstForOTP] = useState('');
  const [loading, setLoading] = useState(true);

  const mobileForOTP = sessionStorage.getItem('mobileForOTP');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container">
        <div className="section-title">Income Details</div>
        <Grid container spacing={2} direction="column" sx={{ marginTop: '40px' }}>
          {/* GST Number */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="gstNumber"
              control={control}
              rules={{
                required: 'GST Number is required',
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'GST_NUMBER', '', 'TEXT_FIELD');
                  return err ? err : true;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group" style={{ position: 'relative' }}>
                  <label>GST Number (Optional)</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      variant="standard"
                      {...field}
                      placeholder="ex.27AAAHX6868N2RN"
                      disabled={gstVerified}
                      fullWidth
                      error={!!fieldState.error}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      className="verify-btn gst-button"
                      onClick={() => {
                        setGstOtpModalOpen(true);
                        setGstForOTP(field.value);
                      }}
                      disabled={gstVerified}
                      style={{ marginLeft: '8px' }}
                    >
                      {gstVerified && field.value ? '✓ Verified' : 'Verify'}
                    </Button>
                  </div>
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
            <OtpVerificationModal
              open={gstOtpModalOpen}
              mobileNumber={mobileForOTP}
              onClose={() => setGstOtpModalOpen(false)}
              onVerify={(otp) => {
                console.log('Entered GST OTP:', otp);
                setGstVerified(true);
                setGstOtpModalOpen(false);
                setValue('gstVerified', true, { shouldValidate: true });
              }}
              onResend={() => {
                console.log('GST OTP Resent to', mobileForOTP);
              }}
            />
          </Grid>

          {/* Firm Name */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="firmName"
              control={control}
              rules={{
                required: 'Firm Name is required',
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'FIRM-NAME', '', 'FIRM-NAME');
                  return err !== '' ? err : true;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Firm Name*</label>
                  <TextField
                    variant="standard"
                    {...field}
                    placeholder="Enter Firm Name"
                    fullWidth
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Sales / Gross Receipts */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="grossReceipts"
              control={control}
              rules={{
                required: 'Gross Receipts are required',
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'GROSS_INCOME', '', 'GROSS_INCOME');
                  return err !== '' ? err : true;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Sales / Gross Receipts (Yearly)</label>
                  <TextField
                    variant="standard"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(formatIndianNumber(e.target.value))}
                    placeholder="Enter in Amount"
                    fullWidth
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Gross Income as per ITR */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="grossIncomeItr"
              control={control}
              rules={{
                required: 'Gross Income as per ITR is required',
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'GROSS_INCOME', '', 'GROSS_INCOME');
                  return err !== '' ? err : true;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Gross Income as per ITR (Last FY)</label>
                  <TextField
                    variant="standard"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(formatIndianNumber(e.target.value))}
                    placeholder="Enter in Amount"
                    fullWidth
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>
        </Grid>
      </div>
    </LoaderWrapper>
  );
}
