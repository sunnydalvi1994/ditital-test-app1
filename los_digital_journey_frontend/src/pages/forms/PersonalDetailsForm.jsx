import React, { useEffect, useState } from 'react';
import {
  Grid,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  Box,
  Typography,
  Tooltip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import '../../styles/components/formAndButtons.css';
import handleVAPT from '../../utils/globalValidation.js';
import LoaderWrapper from '../../components/LoaderWrapper';

export default function PersonalDetailsForm() {
  const { control, watch, formState, setValue } = useFormContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Use unique IDs for better tracking
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      address: '1405 Glendale CHSL Off M G Road Hariniwas Circle Near Majiwada Thane 400604',
      address2: '',
      source: 'Aadhar Card',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400604'
    },
    {
      id: 'addr_2',
      address: '306 GlenEagle Towers Off M G Road Hariniwas Circle Near Majiwada Thane 400604',
      address2: '',
      source: 'Pan Card',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400604'
    },
    {
      id: 'addr_3',
      address: '1800 CrossRoad Heights Off M G Road Hariniwas Circle Near Majiwada Thane 400604',
      address2: '',
      source: 'Passport',
      city: 'Thane',
      state: 'Maharashtra',
      pincode: '400604'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const customer_id = sessionStorage.getItem('customerId');
  const fullName = useWatch({ control, name: 'fullName' });
  const presentAddress = useWatch({ control, name: 'presentAddress' });

  // Sync fullName to sessionStorage
  useEffect(() => {
    if (fullName) {
      sessionStorage.setItem('fullName', fullName);
    }
  }, [fullName]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Start editing
  const handleEditClick = (index) => {
    if (editingIndex !== null) {
      // Already editing another card
      setSnackbar({
        open: true,
        message: 'Please save or cancel the current edit first',
        severity: 'warning'
      });
      return;
    }

    setEditingIndex(index);
    setEditingForm({ ...addresses[index] });
    setValidationErrors({});
    setOpenDialog(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingForm(null);
    setValidationErrors({});
    setOpenDialog(false);
  };

  // Validate edit form

  // const validateEditForm = (form) => {
  //   const errors = {};

  //   if (!form.address || form.address.trim() === '') {
  //     errors.address = 'Address is required';
  //   } else {
  //     const addressError = handleVAPT(
  //       { target: { value: form.address } },
  //       'ADDRESS1',
  //       '',
  //       'TEXT_AREA'
  //     );
  //     if (addressError) errors.address = addressError;
  //   }

  //   if (form.address2) {
  //     const address2Error = handleVAPT(
  //       { target: { value: form.address2 } },
  //       'ADDRESS2',
  //       '',
  //       'TEXT_AREA'
  //     );
  //     if (address2Error) errors.address2 = address2Error;
  //   }

  //   if (!form.city || form.city.trim() === '') {
  //     errors.city = 'City is required';
  //   } else {
  //     const cityError = handleVAPT(
  //       { target: { value: form.city } },
  //       'CITY',
  //       '',
  //       'ALPHABET'
  //     );
  //     if (cityError) errors.city = cityError;
  //   }

  //   if (!form.state || form.state.trim() === '') {
  //     errors.state = 'State is required';
  //   } else {
  //     const stateError = handleVAPT(
  //       { target: { value: form.state } },
  //       'STATE',
  //       '',
  //       'ALPHABET'
  //     );
  //     if (stateError) errors.state = stateError;
  //   }

  //   if (!form.pincode || form.pincode.trim() === '') {
  //     errors.pincode = 'Pincode is required';
  //   } else {
  //     const pincodeError = handleVAPT(
  //       { target: { value: form.pincode } },
  //       'PINCODE',
  //       '',
  //       'PINCODE'
  //     );
  //     if (pincodeError) errors.pincode = pincodeError;
  //   }

  //   return errors;
  // };

  // Save edited address
  const handleSave = async (index) => {
    if (!editingForm) return;

    // Validate
    // const errors = validateEditForm(editingForm);
    // if (Object.keys(errors).length > 0) {
    //   setValidationErrors(errors);
    //   setSnackbar({
    //     open: true,
    //     message: 'Please fix validation errors',
    //     severity: 'error'
    //   });
    //   return;
    // }

    setSaving(true);

    try {
      const previousAddress = addresses[index];
      const updated = { ...previousAddress, ...editingForm };

      // Update local state
      setAddresses((prev) => prev.map((a, i) => (i === index ? updated : a)));

      // If this address was selected, update form value to new ID
      if (presentAddress === previousAddress.id) {
        setValue('presentAddress', updated.id, { shouldValidate: true });
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In real app: await api.saveAddress(updated);

      setSnackbar({
        open: true,
        message: 'Address updated successfully!',
        severity: 'success'
      });

      handleCancelEdit();
    } catch (error) {
      console.error(error);

      setSnackbar({
        open: true,
        message: 'Failed to save address. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle keyboard shortcuts in dialog
  const handleDialogKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <LoaderWrapper loading={loading}>
      <div className="form-container more-about-you">
        <div className="section-title">More About You</div>

        <Grid container spacing={2} direction="column">
          {/* Full Name */}
          <Box
            className="account-section"
            sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <Typography
              variant="h3"
              className="account-question"
              sx={{ marginBottom: '0 !important' }}
            >
              {sessionStorage.getItem('fullName') || ''}
            </Typography>
            {customer_id && (
              <Typography variant="body1">
                Customer No: {customer_id} | Wagle Estate Branch
              </Typography>
            )}
          </Box>

          {/* Gender */}
          <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field, fieldState }) => (
                <div className="form-group plain-input-group">
                  <label>Gender</label>
                  <select {...field} className="plain-select">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldState.error && formState.touchedFields[field.name] && (
                    <span className="error">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
          </Grid>

          {/* Present Address Selection */}
          <Grid container spacing={2} direction="column">
            <div className="form-group" style={{ marginBottom: '8px' }}>
              <label>Present Address</label>
            </div>

            <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
              <Grid container spacing={2} sx={{ mt: 2 }} className="address-grid">
                {addresses.map((addrObj, idx) => (
                  <Grid key={addrObj.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Controller
                      name="presentAddress"
                      control={control}
                      rules={{ required: 'Please select a present address' }}
                      render={({ field }) => (
                        <Box
                          className={`address-card ${field.value === addrObj.id ? 'selected' : ''}`}
                          onClick={() => {
                            if (editingIndex === null) {
                              field.onChange(addrObj.id);
                            }
                          }}
                          sx={{
                            opacity: editingIndex !== null && editingIndex !== idx ? 0.5 : 1,
                            pointerEvents:
                              editingIndex !== null && editingIndex !== idx ? 'none' : 'auto',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {/* Edit Icon */}
                          <IconButton
                            size="small"
                            className="address-edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (editingIndex === idx) {
                                handleCancelEdit();
                              } else {
                                handleEditClick(idx);
                              }
                            }}
                            disabled={editingIndex !== null && editingIndex !== idx}
                          >
                            {editingIndex === idx ? (
                              <CloseIcon className="edit-icon" />
                            ) : (
                              <EditOutlinedIcon className="edit-icon" />
                            )}
                          </IconButton>

                          {/* Source Label */}
                          <Typography className="source-label">
                            Source: {addrObj.source}
                          </Typography>

                          {/* Address Display */}
                          <Box
                            className="address-option"
                            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
                          >
                            <Checkbox
                              checked={field.value === addrObj.id}
                              disabled={editingIndex !== null}
                            />
                            <Typography
                              className="address-text"
                              sx={{ whiteSpace: 'pre-line' }}
                            >
                              {addrObj.address}
                              {addrObj.address2 && `, ${addrObj.address2}`}
                              {addrObj.city && `, ${addrObj.city}`}
                              {addrObj.state && `, ${addrObj.state}`}
                              {addrObj.pincode && ` - ${addrObj.pincode}`}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Error Message */}
              {formState.touchedFields.presentAddress && formState.errors.presentAddress && (
                <Typography className="error-message">
                  {formState.errors.presentAddress.message}
                </Typography>
              )}
            </Grid>

            {/* Same as Permanent checkbox */}
            <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
              <Controller
                name="sameAsPermanent"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value || false} />}
                    label="My present address is different from my permanent address"
                  />
                )}
              />
            </Grid>

            {/* Conditional Permanent Address Inputs */}
            {watch('sameAsPermanent') && (
              <>
                <Grid item size={{ xs: 12, sm: 12, md: 12 }}>
                  <Grid container spacing={2} direction="column">
                    {/* Address 1 */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="address1"
                        control={control}
                        rules={{
                          required: 'Address 1 is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT(
                              { target: { value } },
                              'ADDRESS1',
                              '',
                              'TEXT_AREA'
                            );
                            return err === '' ? true : err;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>Address Line 1</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="House No / Building / Street"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* Address 2 */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="address2"
                        control={control}
                        rules={{
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT(
                              { target: { value } },
                              'ADDRESS2',
                              '',
                              'TEXT_AREA'
                            );
                            return err || true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>Address Line 2 (Optional)</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Landmark / Area"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* City */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="city"
                        control={control}
                        rules={{
                          required: 'City is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT({ target: { value } }, 'CITY', '', 'ALPHABET');
                            return err !== '' ? err : true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>City</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Enter City"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* State */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="state"
                        control={control}
                        rules={{
                          required: 'State is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT({ target: { value } }, 'STATE', '', 'ALPHABET');
                            return err !== '' ? err : true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>State</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Enter State"
                              className="custom-textfield"
                            />
                            {formState.touchedFields[field.name] && fieldState.error && (
                              <span className="error">{fieldState.error.message}</span>
                            )}
                          </div>
                        )}
                      />
                    </Grid>

                    {/* Pincode */}
                    <Grid item size={{ xs: 12, sm: 10, md: 5 }}>
                      <Controller
                        name="pincode"
                        control={control}
                        rules={{
                          required: 'Pincode is required',
                          validate: (value) => {
                            if (!value) return true;
                            const err = handleVAPT({ target: { value } }, 'PINCODE', '', 'PINCODE');
                            return err !== '' ? err : true;
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <div className="form-group">
                            <label>Pincode</label>
                            <TextField
                              variant="standard"
                              fullWidth
                              {...field}
                              placeholder="Enter Pincode"
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
                </Grid>
              </>
            )}
          </Grid>

          {/* House Ownership */}
          <Grid item size={{ xs: 12, sm: 10, md: 12 }}>
            <div className="form-group">
              <label>House Ownership</label>
              <Controller
                name="houseOwnership"
                control={control}
                rules={{ required: 'Please select house ownership' }}
                render={({ field, fieldState }) => (
                  <>
                    <RadioGroup row {...field}>
                      <FormControlLabel value="ownedByMe" control={<Radio />} label="Owned by Me" />

                      <div className="family-owned-wrapper">
                        <FormControlLabel
                          value="familyOwned"
                          control={<Radio />}
                          label="Family Owned"
                        />
                        <Tooltip
                          title="Spouse, Children, Parents, Parent-in-laws, etc."
                          arrow
                          placement="top"
                          className="tooltip-wrapper"
                        >
                          <IconButton size="small" className="info-btn">
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>

                      <FormControlLabel
                        value="notOwned"
                        control={<Radio />}
                        label="Not Owned by me"
                      />
                    </RadioGroup>

                    {fieldState.error && formState.touchedFields[field.name] && (
                      <span className="error">{fieldState.error.message}</span>
                    )}
                  </>
                )}
              />
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Edit Address Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancelEdit}
        onKeyDown={handleDialogKeyDown}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.25s ease-in-out'
          }
        }}
        sx={{
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1.5
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Address
          </Typography>
          <IconButton
            onClick={handleCancelEdit}
            size="small"
            sx={{ color: '#fff' }}
            disabled={saving}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <DialogContent
          sx={{
            backgroundColor: '#f8fafc',
            py: 3,
            '& .MuiGrid-container': {
              display: 'flex !important',
              flexDirection: 'column !important',
              gap: '16px !important'
            },
            '& .MuiFormControl-root': {
              width: '100% !important'
            }
          }}
        >
          {editingForm && (
            <AddressEditForm
              value={editingForm}
              errors={validationErrors}
              onChange={(fieldName, val) =>
                setEditingForm((prev) => ({ ...prev, [fieldName]: val }))
              }
              disabled={saving}
            />
          )}
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            backgroundColor: '#f1f5f9',
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5
          }}
        >
          <Button
            onClick={handleCancelEdit}
            variant="outlined"
            disabled={saving}
            sx={{
              color: '#444',
              borderColor: '#ccc',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { borderColor: '#999' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSave(editingIndex)}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              backgroundColor: '#1976d2',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': { backgroundColor: '#1259a8' }
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            '&.MuiAlert-filledSuccess': {
              backgroundColor: '#4caf50', // Success -
            },
            '&.MuiAlert-filledError': {
              backgroundColor: '#f44336', // Error - Red
            },
            '&.MuiAlert-filledWarning': {
              backgroundColor: '#ff9800', // Warning - Orange
            },
            '&.MuiAlert-filledInfo': {
              backgroundColor: '#2196f3', // Info - Blue
            }
          }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </LoaderWrapper>
  );
}

// Address Edit Form Component
function AddressEditForm({ value, errors = {}, onChange, disabled = false }) {
  if (!value) return null;

  return (
    <Box component="form" sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Address Line 1"
            variant="standard"
            fullWidth
            required
            className="custom-textfield"
            value={value.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Address Line 2 (Optional)"
            variant="standard"
            fullWidth
            className="custom-textfield"
            value={value.address2 || ''}
            onChange={(e) => onChange('address2', e.target.value)}
            error={!!errors.address2}
            helperText={errors.address2}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="City"
            variant="standard"
            fullWidth
            required
            className="custom-textfield"
            value={value.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="State"
            variant="standard"
            fullWidth
            required
            className="custom-textfield"
            value={value.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
            disabled={disabled}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Pincode"
            variant="standard"
            fullWidth
            required
            className="custom-textfield"
            value={value.pincode || ''}
            onChange={(e) => onChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            disabled={disabled}
            inputProps={{ maxLength: 6 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}