import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageWrapper from '../components/PageWrapper';
import '../styles/components/uploadDoc.css';
import '../styles/components/formAndButtons.css';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import handleVAPT from '../utils/globalValidation.js';
import LoaderWrapper from '../components/LoaderWrapper';

export default function DealerInvoice() {
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null); // ✅ create ref

  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({ mode: 'onBlur' });

  const [hasInvoice, setHasInvoice] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);

  const watchInsuranceOwnSource = watch('INSURANCE_OWN_SOURCE');

  const watchFields = watch([
    'EX_SHOWROOM_COST',
    'DISCOUNT',
    'EXCHANGE_AMOUNT',
    'ACCESSORIES',
    'OTHER_TAXES',
    'INSTALLATION_FEE',
    'INSURANCE_AMOUNT'
  ]);

  const exShowroomPrice = 1212233;
  const onRoadPrice = 1312234;
  const insuranceValue = 7000;
  const tentativeFinance = Math.floor(onRoadPrice * 0.9);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInvoiceFile(file);
    }
  };

  const handleRemoveFile = () => {
    setInvoiceFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // ✅ reset using ref instead of document.getElementById
    }
  };

  const onSubmit = () => {
    toast.success('Invoice Created Successfully!', { position: 'bottom-right' });
    navigate('/documentsVerification');
  };

  const allFieldsSelected =
    watch('STATE') &&
    watch('CITY') &&
    watch('BRAND') &&
    watch('MODEL') &&
    watch('VARIANT') &&
    watch('EX_SHOWROOM_COST');

  // ===== Dynamic Total Invoice Calculation =====
  useEffect(() => {
    const parseAmount = (val) => parseInt(val?.replace(/\D/g, '') || 0, 10);

    const total =
      parseAmount(watchFields[0]) - // EX_SHOWROOM_COST
      parseAmount(watchFields[1]) + // DISCOUNT
      parseAmount(watchFields[2]) + // EXCHANGE_AMOUNT
      parseAmount(watchFields[3]) + // ACCESSORIES
      parseAmount(watchFields[4]) + // OTHER_TAXES
      parseAmount(watchFields[5]) + // INSTALLATION_FEE
      (watchInsuranceOwnSource === 'yes' ? parseAmount(watchFields[6]) : 0); // INSURANCE_AMOUNT

    setValue('TOTAL_INVOICE_VALUE', total ? total.toString() : '');
  }, [watchFields, watchInsuranceOwnSource, setValue]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper loading={loading}>
      <PageWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="step-content" sx={{ p: 5 }}>
            {/* Header */}
            <Box className="upload-header">
              <Typography variant="h4" sx={{ color: '#333' }}>
                Select your Car
              </Typography>
            </Box>

            {/* Proforma Invoice Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Upload proforma invoice for the vehicle?
              </Typography>
              <RadioGroup row value={hasInvoice} onChange={(e) => setHasInvoice(e.target.value)}>
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>

              {hasInvoice === 'yes' && (
                <Box sx={{ mt: 2 }}>
                  <input
                    ref={fileInputRef} // ✅ attach ref
                    type="file"
                    id="invoice-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png"
                    disabled={!!invoiceFile}
                  />
                  <label htmlFor="invoice-upload">
                    Upload proforma invoice &nbsp;&nbsp;&nbsp;
                    <Button
                      variant="contained"
                      component="span"
                      className={`verify-btn ${invoiceFile ? 'verified' : ''}`}
                      disabled={!!invoiceFile}
                      sx={{ marginTop: { xs: 1, sm: 1, md: 0 } }}
                    >
                      {invoiceFile ? 'File Selected' : 'Upload'}
                    </Button>
                  </label>

                  {invoiceFile && (
                    <Box className="upload-status-box" sx={{ justifyContent: 'start!important' }}>
                      <Typography className="upload-status">{invoiceFile.name} uploaded</Typography>
                      <IconButton
                        size="small"
                        onClick={handleRemoveFile}
                        className="close-icon-button"
                      >
                        <CloseIcon fontSize="small" sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Car Type */}
            {hasInvoice && !(hasInvoice === 'yes' && invoiceFile) && (
              <>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Select Car Type
                </Typography>
                <RadioGroup
                sx={{mb:1}}
                  row
                  name="CAR_TYPE"
                  value={watch('CAR_TYPE')}
                  onChange={(e) => control.setValue('CAR_TYPE', e.target.value)}
                >
                  <FormControlLabel value="new" control={<Radio />} label="New" />
                  <FormControlLabel value="pre-owned" control={<Radio />} label="Used Car" />
                </RadioGroup>
              </>
            )}

            {/* Car Selection */}
            {hasInvoice && (
              <Grid container spacing={2} >
                {/* Car selection dropdowns */}
                {[
                  { label: 'State', name: 'STATE', options: ['Maharashtra', 'Gujarat'] },
                  { label: 'City', name: 'CITY', options: ['Mumbai', 'Pune'] },
                  { label: 'Car Brand', name: 'BRAND', options: ['Maruti Suzuki', 'Hyundai'] },
                  { label: 'Model', name: 'MODEL', options: ['Ertiga', 'Baleno'] },
                  { label: 'Car Variant', name: 'VARIANT', options: ['ZXI', 'VXI'] }
                ].map(({ label, name, options }) => (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: { xs: '100%', sm: '70%', md: '50%' },
                      mb: 0.1, // ✅ reduce vertical gap between dropdowns only
                    }}
                    key={name}
                  >
                    <div className="form-group plain-input-group" style={{ marginBottom: '4px' }}>
                      <label style={{ marginBottom: '2px', display: 'block' }}>{label}</label>
                      <Controller
                        name={name}
                        control={control}
                        rules={{
                          required: `${label} is required`,
                          validate: (value) => handleVAPT({ target: { value } }, name)
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <select
                              {...field}
                              className={`plain-select ${!field.value ? 'placeholder' : ''}`}
                            >
                              <option value="">Select {label}</option>
                              {options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            {fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </Grid>
                ))}


                {/* Manufacturer Name, Dealer Name, Dealer Address */}
                {[
                  { label: 'Manufacturer Name', name: 'MANUFACTURER_NAME', type: 'ALPHABET' },
                  {
                    label: 'Authorized Dealer Name',
                    name: 'AUTHORIZED_DEALER_NAME',
                    type: 'ALPHABET'
                  },
                  { label: 'Dealer Address', name: 'DEALER_ADDRESS', type: 'TEXT_AREA' }
                ].map(({ label, name, type }) => (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: { xs: '100%', sm: '70%', md: '50%' }
                    }}
                    key={name}
                  >
                    <div className="form-group plain-input-group">
                      <label>{label}</label>
                      <Controller
                        name={name}
                        control={control}
                        rules={{
                          required: `${label} is required`,
                          validate: (value) => handleVAPT({ target: { value } }, name, '', type)
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <input
                              {...field}
                              type="text"
                              className="plain-input"
                              placeholder={`Enter ${label}`}
                            />
                            {fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </Grid>
                ))}

                {/* Dealer Vicinity */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    width: { xs: '100%', sm: '70%', md: '50%' }
                  }}
                >
                  <Typography>Is dealer in vicinity of borrower?</Typography>
                  <Controller
                    name="DEALER_VICINITY"
                    control={control}
                    rules={{
                      validate: (value) => handleVAPT({ target: { value } }, 'DEALER_VICINITY')
                    }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                  {errors.DEALER_VICINITY && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {errors.DEALER_VICINITY?.message}
                    </Typography>
                  )}
                </Grid>

                {/* Insurance Own Source */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    width: { xs: '100%', sm: '70%', md: '50%' }
                  }}
                >
                  <Typography>Insurance from own source?</Typography>
                  <Controller
                    name="INSURANCE_OWN_SOURCE"
                    control={control}
                    rules={{
                      validate: (value) => handleVAPT({ target: { value } }, 'INSURANCE_OWN_SOURCE')
                    }}
                    render={({ field }) => (
                      <RadioGroup row {...field}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                      </RadioGroup>
                    )}
                  />
                  {errors.INSURANCE_OWN_SOURCE && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      {errors.INSURANCE_OWN_SOURCE?.message}
                    </Typography>
                  )}
                </Grid>

                {/* Insurance Amount */}
                {/* {watchInsuranceOwnSource === 'yes' && ( */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    width: { xs: '100%', sm: '70%', md: '50%' }
                  }}
                >
                  <div className="form-group plain-input-group">
                    <label>Insurance Amount</label>
                    <Controller
                      name="INSURANCE_AMOUNT"
                      control={control}
                      rules={{
                        required: 'Insurance Amount is required',
                        validate: (value) =>
                          handleVAPT({ target: { value } }, 'INSURANCE_AMOUNT', '', 'AMOUNT_FIELD')
                      }}
                      render={({ field, fieldState }) => (
                        <>
                          <input
                            {...field}
                            className="plain-input"
                            placeholder="Enter Insurance Amount"
                            value={
                              field.value
                                ? new Intl.NumberFormat('en-IN').format(
                                  field.value.replace(/\D/g, '')
                                )
                                : ''
                            }
                          />
                          {fieldState.error && (
                            <span className="error">{fieldState.error.message}</span>
                          )}
                        </>
                      )}
                    />
                  </div>
                </Grid>
                {/* )} */}

                {/* Amount Fields */}
                {[
                  { label: 'Ex-showroom Cost', name: 'EX_SHOWROOM_COST', type: 'AMOUNT_FIELD' },
                  { label: 'Discount', name: 'DISCOUNT', type: 'AMOUNT_FIELD' },
                  { label: 'Exchange Amount', name: 'EXCHANGE_AMOUNT', type: 'AMOUNT_FIELD' },
                  { label: 'Accessories & Others', name: 'ACCESSORIES', type: 'AMOUNT_FIELD' },
                  { label: 'Other Taxes/GST & Others', name: 'OTHER_TAXES', type: 'AMOUNT_FIELD' },
                  { label: 'Installation Fee', name: 'INSTALLATION_FEE', type: 'AMOUNT_FIELD' }
                ].map(({ label, name, type }) => (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: { xs: '100%', sm: '70%', md: '50%' }
                    }}
                    key={name}
                  >
                    <div className="form-group plain-input-group">
                      <label>{label}</label>
                      <Controller
                        name={name}
                        control={control}
                        rules={{
                          required: `${label} is required`,
                          validate: (value) => handleVAPT({ target: { value } }, name, '', type)
                        }}
                        render={({ field, fieldState }) => (
                          <>
                            <input
                              {...field}
                              type="text"
                              className="plain-input"
                              placeholder={`Enter ${label}`}
                              value={
                                field.value
                                  ? new Intl.NumberFormat('en-IN').format(
                                    field.value.replace(/\D/g, '')
                                  )
                                  : ''
                              }
                            />
                            {fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </Grid>
                ))}

                {/* Total Invoice Value */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    width: { xs: '100%', sm: '70%', md: '50%' }
                  }}
                >
                  <div className="form-group plain-input-group">
                    <label>Total Invoice Value</label>
                    <Controller
                      name="TOTAL_INVOICE_VALUE"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          readOnly
                          className="plain-input"
                          placeholder="Total Invoice Value"
                          value={
                            field.value
                              ? new Intl.NumberFormat('en-IN').format(
                                field.value.replace(/\D/g, '')
                              )
                              : ''
                          }
                        />
                      )}
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    width: { xs: '100%', sm: '70%', md: '50%' }
                  }}
                >
                  {' '}
                  <Typography>Registration:</Typography>{' '}
                  <Controller
                    name="REGISTRATION_TYPE"
                    control={control}
                    rules={{
                      validate: (value) => handleVAPT({ target: { value } }, 'REGISTRATION_TYPE')
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        {' '}
                        <RadioGroup row {...field}>
                          {' '}
                          <FormControlLabel value="bh" control={<Radio />} label="BH" />{' '}
                          <FormControlLabel
                            value="normal"
                            control={<Radio />}
                            label="Normal"
                          />{' '}
                        </RadioGroup>{' '}
                        {fieldState.error && (
                          <span className="error">{fieldState.error.message}</span>
                        )}{' '}
                      </>
                    )}
                  />{' '}
                </Grid>
              </Grid>
            )}

            {/* Prices */}
            {allFieldsSelected && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2">
                  Approximate Insurance Value: Rs. {insuranceValue}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>
                  Ex-Showroom Price #: Rs. {exShowroomPrice.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                  On Road Price #: Rs. {onRoadPrice.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  # Indicative Price. For accurate car price, check with Dealer. Bank will finance
                  90% of the price.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Tentative Finance Amount by Bank: Rs. {tentativeFinance.toLocaleString()}
                </Typography>
              </Box>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type="submit" variant="contained" className="next-btn">
                Proceed
              </Button>
            </Box>
          </Box>
        </form>
      </PageWrapper>
    </LoaderWrapper>
  );
}
