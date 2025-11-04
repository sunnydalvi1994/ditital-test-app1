import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function ReusableInput({ name, label, rules, ...rest }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          helperText={fieldState.error?.message}
          error={!!fieldState.error}
          fullWidth
          {...rest}
        />
      )}
    />
  );
}
