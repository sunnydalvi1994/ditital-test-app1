import React, { useEffect, useState } from 'react';
import { Grid, IconButton, Tooltip, Button, TextField } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import handleVAPT from '../../utils/globalValidation.js';
import '../../styles/components/formAndButtons.css';
import LoaderWrapper from '../../components/LoaderWrapper';

// Indian number formatter
const formatIndianNumber = (num = '') => {
  const x = num.replace(/\D/g, '');
  return x.length > 3
    ? x.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + x.slice(-3)
    : x;
};

export default function IncomeDetailsForm() {
  const { control, watch, setValue, formState } = useFormContext();

  const [uanOtpModalOpen, setUanOtpModalOpen] = useState(false);
  const [uanVerified, setUanVerified] = useState(false);
  const [setUanForOTP] = useState('');
  const [loading, setLoading] = useState(true);

  const mobileForOTP = sessionStorage.getItem('mobileForOTP');

  const grossIncome = watch('grossIncome') || '';
  const bonusOvertime = watch('bonusOvertime') || '';
  const totalEmi = watch('totalEmi') || '';

  useEffect(() => {
    const parseValue = (val) => Number(val.replace(/,/g, '')) || 0;
    const balance = parseValue(grossIncome) - (parseValue(bonusOvertime) + parseValue(totalEmi));

    setValue('balanceInHand', balance > 0 ? formatIndianNumber(balance.toString()) : '0', {
      shouldValidate: true
    });
  }, [grossIncome, bonusOvertime, totalEmi, setValue]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container">
        <div className="section-title">Income Details</div>
        <Grid container spacing={2} direction="column" sx={{ marginTop: '40px' }}>
          {/* UAN Field */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="uan"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return true; // optional field: skip if empty
                  const err = handleVAPT({ target: { value } }, 'UAN', '', 'TEXT_FIELD');
                  return err ? err : true;
                }
              }}
              render={({ field }) => (
                <div className="form-group mobile-group uan-group">
                  <label>UAN (Optional)</label>
                  <Tooltip title="UAN is usually printed on Salary Slip" arrow placement="top">
                    <IconButton size="small" className="uan-info-btn">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <div className="mobile-input-container">
                    <TextField
                      variant="standard"
                      fullWidth
                      {...field}
                      placeholder="Enter Your UAN Number"
                      disabled={uanVerified}
                      className="custom-textfield"
                    />

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setUanOtpModalOpen(true);
                        setUanForOTP(field.value);
                      }}
                      disabled={uanVerified}
                      className="verify-btn"
                    >
                      {uanVerified && field.value ? '✓ Verified' : 'Verify'}
                    </Button>
                  </div>
                  {/* 
                {formState.touchedFields[field.name] && fieldState.error && (
                  <span className="error">{fieldState.error.message}</span>
                )} */}
                </div>
              )}
            />

            <OtpVerificationModal
              open={uanOtpModalOpen}
              mobileNumber={mobileForOTP}
              onClose={() => setUanOtpModalOpen(false)}
              onVerify={(otp) => {
                console.log('Entered UAN OTP:', otp);
                setUanVerified(true);
                setUanOtpModalOpen(false);
                setValue('uanVerified', true, { shouldValidate: true });
              }}
              onResend={() => {
                console.log('UAN OTP Resent to', mobileForOTP);
              }}
            />
          </Grid>

          {/* Employer Name */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="employerName"
              control={control}
              rules={{
                required: 'Employer Name is required',
                validate: (value) => {
                  const err = handleVAPT({ target: { value } }, 'EMPLOYER_NAME', '', 'ALPHABET');
                  return err === undefined || err === true ? true : err;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Employer Name</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    placeholder="Enter Name"
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Designation */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="designation"
              control={control}
              rules={{
                required: 'Designation is required',
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'DESIGNATION', '', 'ALPHABET');
                  return err === undefined || err === true ? true : err;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Designation</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    placeholder="Enter Designation"
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Gross Monthly Income */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="grossIncome"
              control={control}
              rules={{
                required: 'Gross Income is required',
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'GROSS_INCOME', '', 'AMOUNT_FIELD');
                  return err === undefined || err === true ? true : err;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Gross Monthly Income</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(formatIndianNumber(e.target.value))}
                    placeholder="Enter Gross Monthly Income"
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Bonus, Overtime */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="bonusOvertime"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT(
                    { target: { value } },
                    'BONUS_OVERTIME',
                    '',
                    'AMOUNT_FIELD'
                  );
                  return err || true;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Less: Bonus, Overtime, Arrears (one-time/ad-hoc)</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(formatIndianNumber(e.target.value))}
                    placeholder="Ex. 5,000"
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Total EMI */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="totalEmi"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return true;
                  const err = handleVAPT({ target: { value } }, 'TOTAL_EMI', '', 'AMOUNT_FIELD');
                  return err || true;
                }
              }}
              render={({ field, fieldState }) => (
                <div className="form-group">
                  <label>Less: Total EMI / Fixed Monthly Payments</label>
                  <TextField
                    variant="standard"
                    fullWidth
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(formatIndianNumber(e.target.value))}
                    placeholder="Ex. 5,000"
                    className="custom-textfield"
                  />
                  {formState.touchedFields[field.name] && fieldState.error && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Balance in Hand */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="balanceInHand"
              control={control}
              render={({ field }) => (
                <div className="form-group">
                  <label>Balance in Hand</label>
                  <TextField variant="standard" fullWidth {...field} className="custom-textfield" />
                </div>
              )}
            />
          </Grid>
        </Grid>
      </div>
    </LoaderWrapper>
  );
}
