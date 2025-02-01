import React, { useState } from 'react';
import { useField, useFormikContext } from 'formik';

import { Container, ErrorMessage, Input, Label } from './style';

interface InputFieldProps {
  label: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  type?: string;
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const {
    label,
    min = 0,
    max = 1000,
    step = 1,
    placeholder = '',
    type = 'number',
    name,
  } = props;

  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      type === 'number' ? Number(e.target.value) : e.target.value;
    setFieldValue(name, newValue);
  };

  return (
    <Container>
      <Label>{label}</Label>
      <Input
        type={type}
        value={field.value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        isError={!!meta.error}
      />
      {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
    </Container>
  );
};
