/**
 * Input组件 - 工业风格输入框
 */

import React, { forwardRef } from 'react';
import type { InputProps } from '../../../types';
import styles from './Input.module.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    styles.input,
    error && styles.error,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.inputWrapper}>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
