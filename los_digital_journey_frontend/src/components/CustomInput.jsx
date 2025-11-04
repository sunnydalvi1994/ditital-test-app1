
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Box, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';
import handleVAPT from '../utils/globalValidation';

export default function CustomInput({
    name,
    type = 'text',
    label,
    control,
    errors,
    isRequired = false,
    placeholder,
    onChange: externalOnChange,
    multiline = false,
    disabled = false,
    isMultipleError = false,
    rows = 1,
    fieldCode,
    fieldType,
    ...props
}) {
    const [validationError, setValidationError] = useState('');

    return (
        <Box>
            {label && (
                <Typography variant="h6" className="formLabel">
                    {label} {isRequired && <span style={{ color: 'red' }}>*</span>}
                </Typography>
            )}

            <Controller
                name={name}
                control={control}
                rules={{
                    required: `${name} is required`,
                    validate: {
                        validation: (value) => {
                            const result = handleVAPT({ target: { value } }, fieldCode || name, fieldType);
                            return result === true || result;
                        }
                    }
                }} // Add validation rules here
                render={({ field: { onChange, onBlur, value, ...restField } }) => {
                    const handleClear = () => {
                        onChange('');
                        setValidationError('');
                        if (externalOnChange) {
                            externalOnChange({ target: { value: '' } });
                        }
                    };

                    const handleInputChange = (e) => {
                        const validationResult = handleVAPT(
                            e,
                            fieldCode || name,
                            fieldType || type
                        );

                        setValidationError(typeof validationResult === 'string' ? validationResult : '');

                        if (validationResult === true || typeof validationResult === 'string') {
                            onChange(e);
                            if (externalOnChange) externalOnChange(e);
                        }
                    };

                    // Add handleBlur function
                    const handleBlur = (e) => {
                        onBlur(e); // Trigger RHF validation
                        const validationResult = handleVAPT(
                            { target: { value: value || '' } },
                            fieldCode || name,
                            fieldType || type
                        );
                        setValidationError(typeof validationResult === 'string' ? validationResult : '');
                    };

                    let fieldError;
                    if (isMultipleError) {
                        const fieldKey = name.split('.').pop();
                        fieldError = errors?.[fieldKey];
                    } else {
                        fieldError = errors?.[name];
                    }

                    return (
                        <TextField
                            {...restField}
                            type={type}
                            fullWidth
                            placeholder={placeholder || `Enter ${label}`}
                            inputProps={{ className: 'textInput' }}
                            error={!!fieldError || !!validationError}
                            helperText={fieldError?.message || validationError}
                            FormHelperTextProps={{ style: { color: 'red', fontWeight: 300 } }}
                            value={value || ''}
                            multiline={multiline}
                            disabled={disabled}
                            rows={rows}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // Add onBlur handler
                            InputProps={{
                                endAdornment:
                                    value && !disabled ? (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClear} edge="end">
                                                <AiOutlineClose size="1rem" />
                                            </IconButton>
                                        </InputAdornment>
                                    ) : null
                            }}
                            {...props}
                        />
                    );
                }}
            />
        </Box>
    );
}
