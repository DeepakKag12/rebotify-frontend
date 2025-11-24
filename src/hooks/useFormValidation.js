import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation with real-time feedback using Yup
 * 
 * @param {Object} schema - Yup validation schema
 * @param {Object} initialValues - Initial form values
 * @returns {Object} - Form state and handlers
 */
const useFormValidation = (schema, initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    async (fieldName, value) => {
      try {
        // Get the schema for this specific field
        const fieldSchema = schema.fields[fieldName];
        
        if (!fieldSchema) {
          return null;
        }

        // Validate the field value
        await fieldSchema.validate(value);
        
        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        
        return null;
      } catch (error) {
        // Set error for this field
        const errorMessage = error.message;
        setErrors((prev) => ({
          ...prev,
          [fieldName]: errorMessage,
        }));
        
        return errorMessage;
      }
    },
    [schema]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback(async () => {
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors = {};
      
      if (error.inner) {
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
      }
      
      setErrors(validationErrors);
      return false;
    }
  }, [schema, values]);

  /**
   * Handle field change with real-time validation
   */
  const handleChange = useCallback(
    async (e) => {
      const { name, value, type, checked } = e.target;
      const fieldValue = type === 'checkbox' ? checked : value;

      // Update field value
      setValues((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Mark field as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate field in real-time only if it has been touched
      if (touched[name] || value) {
        await validateField(name, fieldValue);
      }
    },
    [validateField, touched]
  );

  /**
   * Handle field blur (when user leaves the field)
   */
  const handleBlur = useCallback(
    async (e) => {
      const { name, value } = e.target;

      // Mark field as touched
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur
      await validateField(name, value);
    },
    [validateField]
  );

  /**
   * Set a field value manually (programmatically)
   */
  const setFieldValue = useCallback(
    async (fieldName, value, shouldValidate = true) => {
      setValues((prev) => ({
        ...prev,
        [fieldName]: value,
      }));

      if (shouldValidate) {
        await validateField(fieldName, value);
      }
    },
    [validateField]
  );

  /**
   * Set a field error manually
   */
  const setFieldError = useCallback((fieldName, error) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  /**
   * Clear a field error
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * Set multiple values at once
   */
  const setValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    clearFieldError,
    clearErrors,
    validateField,
    validateForm,
    resetForm,
    setValues,
  };
};

export default useFormValidation;
