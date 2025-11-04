import { useEffect } from 'react';

export default function useFormPersistence(formKey, watch) {
  // watch is a function that returns current form values (e.g. react-hook-form's watch)
  useEffect(() => {
    const subscription = watch((values) => {
      try {
        localStorage.setItem(formKey, JSON.stringify(values));
      } catch (e) {
        // swallow
        console.error('Failed to save form data', e);
      }
    });
    return () => subscription.unsubscribe?.();
  }, [formKey, watch]);
}
