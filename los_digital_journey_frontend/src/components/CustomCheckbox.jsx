import { useForm } from 'react-hook-form';

export default function CustomCheckbox({ name, control, label, onClick }) {
  const { watch } = useForm();
  const isChecked = watch(name, false);

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          rules={{ required: true }}
          render={({ field }) => <Checkbox {...field} />}
        />
      }
      label={<span className={`checkbox-label ${isChecked ? 'checked' : ''}`}>{label}</span>}
      onClick={onClick}
    />
  );
}
