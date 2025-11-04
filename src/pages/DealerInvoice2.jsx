import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PageWrapper from '../components/PageWrapper';
import '../styles/components/uploadDoc.css';
import '../styles/components/formAndButtons.css';
import '../styles/global.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import handleVAPT from '../utils/globalValidation';

export default function DealerInvoice() {
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const onSubmit = () => {
    toast.success('Invoice Created Successfully!');
    navigate('/documentsVerification');
  };

  const allFieldsSelected =
    watch('STATE') &&
    watch('CITY') &&
    watch('BRAND') &&
    watch('MODEL') &&
    watch('VARIANT') &&
    watch('MANUFACTURER_NAME') &&
    watch('AUTHORIZED_DEALER_NAME') &&
    watch('DEALER_ADDRESS') &&
    watch('DEALER_VICINITY') &&
    watch('INSURANCE_OWN_SOURCE') &&
    (watchInsuranceOwnSource !== 'yes' || watch('INSURANCE_AMOUNT')) &&
    watch('DOWN_PAYMENT_AMOUNT') &&
    watch('INVOICE_DATE') &&
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

  return (
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
                  type="file"
                  id="invoice-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.png"
                />
                <label htmlFor="invoice-upload">
                  Upload proforma invoice &nbsp;&nbsp;&nbsp;
                  <Button
                    variant="contained"
                    component="span"
                    className={`verify-btn ${invoiceFile ? 'verified' : ''}`}
                  >
                    {invoiceFile ? 'File Selected' : 'Upload'}
                  </Button>
                </label>
                {invoiceFile && (
                  <Typography sx={{ mt: 1, fontSize: 14, color: 'green' }}>
                    {invoiceFile.name} uploaded
                  </Typography>
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
                  key={name}
                  sx={{
                    width: '50%',
                    mb: 0.8 // ✅ reduces vertical space between dropdowns only
                  }}
                >
                  <div
                    className="form-group plain-input-group"
                    style={{
                      marginBottom: '4px' // tighter spacing
                    }}
                  >
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '2px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#333'
                      }}
                    >
                      {label}
                    </label>

                    <Controller
                      name={name}
                      control={control}
                      rules={{
                        required: `${label} is required`,
                        validate: (value) => handleVAPT({ target: { value } }, name)
                      }}
                      render={({ field, fieldState }) => (
                        <div className="form-group" style={{ marginBottom: '0' }}>
                          <select
                            {...field}
                            className={`plain-select ${!field.value ? 'placeholder' : ''}`}
                            style={{
                              width: '100%',
                              padding: '9px 10px',
                              borderRadius: '8px',
                              border: '1px solid #ccc',
                              fontSize: '14px',
                              color: field.value ? '#333' : '#888',
                              backgroundColor: '#fff'
                            }}
                          >
                            <option value="">Select {label}</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {fieldState.error && (
                            <span
                              className="error"
                              style={{
                                color: 'red',
                                fontSize: '12px',
                                marginTop: '3px',
                                display: 'block'
                              }}
                            >
                              {fieldState.error.message}
                            </span>
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
                <Grid item xs={12} sx={{ width: '50%' }} key={name}>
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
              <Grid item xs={12} sx={{ width: '50%' }}>
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
              <Grid item xs={12} sx={{ width: '50%' }}>
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
              {watchInsuranceOwnSource === 'yes' && (
                <Grid item xs={12} sx={{ width: '50%' }}>
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
              )}
              {/* Amount Fields */}
              {[
                { label: 'Ex-showroom Cost', name: 'EX_SHOWROOM_COST', type: 'AMOUNT_FIELD' },
                { label: 'Discount', name: 'DISCOUNT', type: 'AMOUNT_FIELD' },
                { label: 'Exchange Amount', name: 'EXCHANGE_AMOUNT', type: 'AMOUNT_FIELD' },
                { label: 'Accessories & Others', name: 'ACCESSORIES', type: 'AMOUNT_FIELD' },
                { label: 'Other Taxes/GST & Others', name: 'OTHER_TAXES', type: 'AMOUNT_FIELD' },
                { label: 'Installation Fee', name: 'INSTALLATION_FEE', type: 'AMOUNT_FIELD' }
              ].map(({ label, name, type }) => (
                <Grid item xs={12} sx={{ width: '50%' }} key={name}>
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
              <Grid item xs={12} sx={{ width: '50%' }}>
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
                            ? new Intl.NumberFormat('en-IN').format(field.value.replace(/\D/g, ''))
                            : ''
                        }
                      />
                    )}
                  />
                </div>
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
                # Indicative Price. For accurate car price, check with Dealer. Bank will finance 90%
                of the price.
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
  );
}
