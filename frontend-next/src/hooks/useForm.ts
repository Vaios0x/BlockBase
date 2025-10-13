'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface FormField<T> {
  value: T
  error?: string
  touched: boolean
  required?: boolean
}

interface FormState<T extends Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  isDirty: boolean
}

interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => Promise<void> | void
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true
}: UseFormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false
  })

  const initialValuesRef = useRef(initialValues)

  // Validar formulario
  const validateForm = useCallback((values: T) => {
    if (!validate) return {}

    const errors = validate(values)
    const isValid = Object.keys(errors).length === 0

    setState(prev => ({
      ...prev,
      errors,
      isValid
    }))

    return errors
  }, [validate])

  // Manejar cambios en campos
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => {
      const newValues = { ...prev.values, [field]: value }
      const newErrors = { ...prev.errors }
      delete newErrors[field]

      // Validar campo individual si hay validación
      if (validate && validateOnChange) {
        const fieldErrors = validate(newValues)
        if (fieldErrors[field]) {
          newErrors[field] = fieldErrors[field]
        }
      }

      return {
        ...prev,
        values: newValues,
        errors: newErrors,
        isDirty: JSON.stringify(newValues) !== JSON.stringify(initialValuesRef.current),
        isValid: Object.keys(newErrors).length === 0
      }
    })
  }, [validate, validateOnChange])

  // Manejar blur de campos
  const setTouched = useCallback(<K extends keyof T>(field: K) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true }
    }))

    // Validar campo en blur si está configurado
    if (validate && validateOnBlur) {
      const fieldErrors = validate(state.values)
      if (fieldErrors[field]) {
        setState(prev => ({
          ...prev,
          errors: { ...prev.errors, [field]: fieldErrors[field] }
        }))
      }
    }
  }, [validate, validateOnBlur, state.values])

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    // Marcar todos los campos como touched
    const allTouched = Object.keys(state.values).reduce((acc, key) => {
      acc[key as keyof T] = true
      return acc
    }, {} as Record<keyof T, boolean>)

    setState(prev => ({
      ...prev,
      touched: allTouched,
      isSubmitting: true
    }))

    // Validar formulario completo
    const errors = validateForm(state.values)

    if (Object.keys(errors).length > 0) {
      setState(prev => ({
        ...prev,
        isSubmitting: false
      }))
      return
    }

    try {
      await onSubmit(state.values)
      setState(prev => ({
        ...prev,
        isSubmitting: false
      }))
    } catch (error) {
      console.error('Error submitting form:', error)
      setState(prev => ({
        ...prev,
        isSubmitting: false
      }))
    }
  }, [state.values, validateForm, onSubmit])

  // Resetear formulario
  const reset = useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false
    })
    initialValuesRef.current = initialValues
  }, [initialValues])

  // Obtener props de campo
  const getFieldProps = useCallback(<K extends keyof T>(field: K) => {
    return {
      value: state.values[field],
      onChange: (value: T[K]) => setValue(field, value),
      onBlur: () => setTouched(field),
      error: state.touched[field] ? state.errors[field] : undefined,
      touched: state.touched[field] || false
    }
  }, [state.values, state.errors, state.touched, setValue, setTouched])

  // Obtener error de campo
  const getFieldError = useCallback(<K extends keyof T>(field: K) => {
    return state.touched[field] ? state.errors[field] : undefined
  }, [state.errors, state.touched])

  // Verificar si campo tiene error
  const hasFieldError = useCallback(<K extends keyof T>(field: K) => {
    return !!(state.touched[field] && state.errors[field])
  }, [state.errors, state.touched])

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    isDirty: state.isDirty,
    setValue,
    setTouched,
    handleSubmit,
    reset,
    getFieldProps,
    getFieldError,
    hasFieldError,
    validateForm
  }
}
