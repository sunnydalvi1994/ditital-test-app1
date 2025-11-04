import React, { useEffect, useState } from 'react';
import LoaderWrapper from '../components/LoaderWrapper';
import PageWrapper from '../components/PageWrapper';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  Button
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import '../styles/components/formAndButtons.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import handleVAPT from '../utils/globalValidation.js';

const SelectHomeInvoice = () => {
  const [loading, setLoading] = useState(true);

  // Main selection states
  const [propertyKind, setPropertyKind] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [propertyIdentified, setPropertyIdentified] = useState('');

  // changes start here
  const {
    control,
    handleSubmit,
    setValue
  } = useForm({ mode: 'onChange', shouldUnregister: true });


  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Property Kind options
  const propertyKindOptions = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' }
  ];

  // Property Type options based on Property Kind
  const getPropertyTypeOptions = () => {
    const options = {
      residential: [
        { value: 'flat', label: 'Flat' },
        { value: 'independent_house', label: 'Independent House' },
        { value: 'plot', label: 'Plot' }
      ],
      commercial: [
        { value: 'office_space', label: 'Office Space' },
        { value: 'plot', label: 'Plot' }
      ],
      industrial: [
        { value: 'plot', label: 'Plot' },
        { value: 'sheds', label: 'Sheds' }
      ]
    };
    return options[propertyKind] || [];
  };

  // Property Status options based on Property Type
  const getPropertyStatusOptions = () => {
    if (!propertyType) return [];

    const flatOfficeIndustrialStatuses = [
      { value: 'resale', label: 'Resale' },
      { value: 'new_home_loan', label: 'New Home Loan' },
      { value: 'construction_linked', label: 'Construction Linked' },
      { value: 'balance_transfer', label: 'Balance Transfer' }
    ];

    if (propertyKind === 'residential') {
      if (propertyType === 'flat') return flatOfficeIndustrialStatuses;
      if (propertyType === 'independent_house') {
        return [
          { value: 'resale', label: 'Resale' },
          { value: 'construction', label: 'Construction' }
        ];
      }
      if (propertyType === 'plot') return [{ value: 'sale', label: 'Sale' }];
    } else if (propertyKind === 'commercial') {
      if (propertyType === 'office_space') return flatOfficeIndustrialStatuses;
      if (propertyType === 'plot') return [{ value: 'sale', label: 'Sale' }];
    } else if (propertyKind === 'industrial') {
      return flatOfficeIndustrialStatuses;
    }
    return [];
  };

  // Property Identified options
  const propertyIdentifiedOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  // Field visibility logic
  const getVisibleFields = () => {
    if (!propertyKind || !propertyType || !propertyStatus) return { address: [], property: [] };

    // Address fields visibility rules
    const addressFields =
      propertyKind === 'residential' && propertyType === 'flat' && propertyIdentified === 'yes'
        ? [
          'projectName',
          'builderName',
          'appStatus',
          'houseNo',
          'addressLine1',
          'addressLine2',
          'streetName',
          'landmark',
          'tehsil',
          'city',
          'state',
          'zipCode'
        ]
        : [];

    // Property detail fields visibility rules
    let propertyFields = [];
    if (propertyIdentified === 'yes') {
      const hasNoOfBHK =
        propertyKind === 'residential' &&
        (propertyType === 'flat' || propertyType === 'independent_house');
      const commonFields = [
        'carpetAreaSqft',
        'superAreaSqft',
        'marketRate',
        'propertyCost',
        'landCost',
        'buildingCost',
        'salesDeedCost',
        'registryCost',
        'totalCost',
        'loanRequired'
      ];

      if (hasNoOfBHK) {
        propertyFields = ['noOfBHK', 'floor', 'ownership', ...commonFields];
      } else {
        propertyFields = commonFields;
      }
    } else if (propertyIdentified === 'no') {
      propertyFields = ['usageOfProperty'];
    }

    return { address: addressFields, property: propertyFields };
  };

  const visibleFields = getVisibleFields();

  // Reset dependent fields when selections change
  const handlePropertyKindChange = (value) => {
    setPropertyKind(value);
    setPropertyType('');
    setPropertyStatus('');
    setPropertyIdentified('');
    // Sync form fields
    setValue('PROPERTY_TYPE', '');
    setValue('PROPERTY_STATUS', '');
    setValue('PROPERTY_IDENTIFIED', '');
    setValue('PROPERTY_KIND', value);
  };

  const handlePropertyTypeChange = (value) => {
    setPropertyType(value);
    setPropertyStatus('');
    setPropertyIdentified('');
    // Sync form fields
    setValue('PROPERTY_STATUS', '');
    setValue('PROPERTY_IDENTIFIED', '');
    setValue('PROPERTY_TYPE', value);
  };

  const handlePropertyStatusChange = (value) => {
    setPropertyStatus(value);
    setPropertyIdentified('');
    // Sync form fields
    setValue('PROPERTY_IDENTIFIED', '');
    setValue('PROPERTY_STATUS', value);
  };

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    toast.success('Property Details Submitted Successfully!', { position: 'bottom-right' });
    navigate('/documentsVerification');
  };

  // Field configurations
  const addressFieldConfig = {
    projectName: { label: 'Project Name', name: 'PROJECT_NAME', validation: 'TEXT_FIELD' },
    builderName: { label: 'Builder Name', name: 'BUILDER_NAME', validation: 'ALPHABET' },
    appStatus: { label: 'APP Status', name: 'APP_STATUS', validation: 'TEXT_FIELD' },
    houseNo: { label: 'House No', name: 'HOUSE_NO', validation: 'TEXT_FIELD' },
    addressLine1: { label: 'Address Line 1', name: 'ADDRESS1', validation: 'TEXT_AREA' },
    addressLine2: { label: 'Address Line 2', name: 'ADDRESS2', validation: 'TEXT_AREA' },
    streetName: { label: 'Street Name', name: 'STREET_NAME', validation: 'TEXT_FIELD' },
    landmark: { label: 'Landmark', name: 'LANDMARK', validation: 'TEXT_FIELD' },
    tehsil: { label: 'Tehsil', name: 'TEHSIL', validation: 'ALPHABET' },
    city: { label: 'City', name: 'CITY', validation: 'ALPHABET' },
    state: { label: 'State', name: 'STATE', validation: 'ALPHABET' },
    zipCode: { label: 'Zip Code', name: 'PINCODE', validation: 'TEXT_FIELD' }
  };

  const propertyFieldConfig = {
    noOfBHK: { label: 'No of BHK', name: 'NO_OF_BHK', validation: 'NUMBER_FIELD', type: 'text' },
    floor: { label: 'Floor', name: 'FLOOR', validation: 'NUMBER_FIELD', type: 'text' },
    ownership: {
      label: 'Ownership of Property',
      name: 'OWNERSHIP',
      type: 'select',
      options: [
        { value: '', label: 'Select Ownership' },
        { value: 'freehold', label: 'Freehold' },
        { value: 'leasehold', label: 'Leasehold' }
      ]
    },
    carpetAreaSqft: { label: 'Carpet Area Sqft', name: 'CARPET_AREA_SQFT', validation: 'NUMBER_FIELD', type: 'text' },
    superAreaSqft: { label: 'Super Area Sqft', name: 'SUPER_AREA_SQFT', validation: 'NUMBER_FIELD', type: 'text' },
    marketRate: { label: 'Applicable Market Rate', name: 'MARKET_RATE', validation: 'AMOUNT_FIELD', type: 'amount' },
    propertyCost: { label: 'Property Cost', name: 'PROPERTY_COST', validation: 'AMOUNT_FIELD', type: 'amount' },
    landCost: { label: 'Land Cost', name: 'LAND_COST', validation: 'AMOUNT_FIELD', type: 'amount' },
    buildingCost: { label: 'Building Cost', name: 'BUILDING_COST', validation: 'AMOUNT_FIELD', type: 'amount' },
    salesDeedCost: { label: 'Sales Deed Cost', name: 'SALES_DEED_COST', validation: 'AMOUNT_FIELD', type: 'amount' },
    registryCost: { label: 'Registry Cost', name: 'REGISTRY_COST', validation: 'AMOUNT_FIELD', type: 'amount' },
    totalCost: { label: 'Total Cost', name: 'TOTAL_COST', validation: 'AMOUNT_FIELD', type: 'amount' },
    loanRequired: { label: 'Loan Required', name: 'LOAN_REQUIRED', validation: 'AMOUNT_FIELD', type: 'amount' },
    usageOfProperty: {
      label: 'Usage of Property',
      name: 'USAGE_OF_PROPERTY',
      type: 'select',
      options: [
        { value: '', label: 'Select Usage' },
        { value: 'self_usage', label: 'Self Usage' },
        { value: 'others', label: 'Others' }
      ]
    }
  };

  // Render functions
  const renderSelectField = (label, name, options, onChange, disabled = false, rules = {}) => (
    <Grid item xs={12} sx={{ width: { xs: '100%', sm: '70%', md: '50%' }, mb: 0.1 }}>
      <div className="form-group plain-input-group" style={{ marginBottom: '4px' }}>
        <label style={{ marginBottom: '12px', display: 'block' }}>{label}</label>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => (
            <>
              <select
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onChange && onChange(e.target.value);
                }}
                disabled={disabled}
                className={`plain-select ${!field.value ? 'placeholder' : ''}`}
              >
                <option value="">Select</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldState.error && <span className="error">{fieldState.error.message}</span>}
            </>
          )}
        />
      </div>
    </Grid>
  );

  // 🛡️ Prevent typing of special characters
  const preventSpecialChars = (e) => {
    const key = e.key;
    const allowed = /^[A-Za-z0-9\s]$/; // only letters, numbers, and spaces allowed

    if (!allowed.test(key)) {
      e.preventDefault(); // block the key press
    }
  };


  const renderTextField = (config) => (
    <Grid item xs={12} sx={{ width: { xs: '100%', sm: '70%', md: '50%' }, mb: 0.1 }} key={config.name}>
      <div className="form-group plain-input-group" style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '6px', display: 'block' }}>{config.label}</label>
        <Controller
          name={config.name}
          control={control}
          rules={{
            required: `${config.label} is required`,
            ...(config.validation && {
              validate: (value) => handleVAPT({ target: { value } }, config.name, '', config.validation)
            })
          }}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                type="text"
                className="plain-input"
                placeholder={`Enter ${config.label}`}
                onKeyDown={preventSpecialChars}
                {...(config.type === 'amount' && {
                  value: field.value
                    ? new Intl.NumberFormat('en-IN').format(
                      field.value.replace(/\D/g, '')
                    )
                    : ''
                })}
              />
              {fieldState.error && <span className="error">{fieldState.error.message}</span>}
            </>
          )}
        />
      </div>
    </Grid>
  );

  const renderSelectWithOptions = (config) => (
    <Grid item xs={12} sx={{ width: { xs: '100%', sm: '70%', md: '50%' }, mb: 0.1 }} key={config.name}>
      <div className="form-group plain-input-group" style={{ marginBottom: '4px' }}>
        <label style={{ marginBottom: '12px', display: 'block' }}>{config.label}</label>
        <Controller
          name={config.name}
          control={control}
          rules={{ required: `${config.label} is required` }}
          render={({ field, fieldState }) => (
            <>
              <select {...field} className={`plain-select ${!field.value ? 'placeholder' : ''}`}>
                {config.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldState.error && <span className="error">{fieldState.error.message}</span>}
            </>
          )}
        />
      </div>
    </Grid>
  );

  const renderField = (fieldKey) => {
    const config = propertyFieldConfig[fieldKey];
    if (!config) return null;

    if (config.type === 'select') {
      return renderSelectWithOptions(config);
    }
    return renderTextField(config);
  };

  return (
    <LoaderWrapper loading={loading}>
      <div className="wrapper-main">
        <div className="wrapper-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: 'center',
                marginBottom: '40px',
                fontWeight: 700,
                color: '#0d4689',
                fontSize: { xs: '1rem', sm: '1.5rem', md: '1.8rem' }
              }}
            >
              Tell me about Your Property
            </Typography>

            {/* Main Selection Section */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, ml: 4 }}>
                {renderSelectField(
                  'What kind of Property you want to purchase',
                  'PROPERTY_KIND',
                  propertyKindOptions,
                  handlePropertyKindChange,
                  false,
                  { required: 'Property kind is required' }
                )}

                {renderSelectField(
                  'What Type of Property you want to purchase',
                  'PROPERTY_TYPE',
                  getPropertyTypeOptions(),
                  handlePropertyTypeChange,
                  !propertyKind,
                  { required: 'Property type is required' }
                )}

                {renderSelectField(
                  'What is the status of property',
                  'PROPERTY_STATUS',
                  getPropertyStatusOptions(),
                  handlePropertyStatusChange,
                  !propertyType,
                  { required: 'Property status is required' }
                )}

                {renderSelectField(
                  'Have You identified the Property',
                  'PROPERTY_IDENTIFIED',
                  propertyIdentifiedOptions,
                  (value) => setPropertyIdentified(value),
                  !propertyStatus,
                  { required: 'This field is required' }
                )}
              </Box>
            </Paper>

            {/* Address Details Section */}
            {visibleFields.address.length > 0 && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: '#0d4689',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    ml: 2
                  }}
                >
                  Address Details
                </Typography>
                <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Grid container spacing={2} sx={{ ml: 4 }}>
                    {visibleFields.address.map((fieldKey) => {
                      const config = addressFieldConfig[fieldKey];
                      return config ? renderTextField(config) : null;
                    })}
                  </Grid>
                </Paper>
              </>
            )}

            {/* Property Details Section */}
            {visibleFields.property.length > 0 && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: '#0d4689',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    ml: 2
                  }}
                >
                  Property Details
                </Typography>
                <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Grid container spacing={2} sx={{ ml: 4 }}>
                    {visibleFields.property.map(renderField)}
                  </Grid>
                </Paper>
              </>
            )}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button type="submit" variant="contained" className="next-btn">
                Proceed
              </Button>
            </Box>
          </form>
        </div>
      </div>
    </LoaderWrapper>
  );
};

export default SelectHomeInvoice;