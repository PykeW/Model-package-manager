/**
 * Select组件 - 工业风格选择框
 */

import React, { forwardRef } from 'react';
import type { SelectProps } from '../../../types';
import styles from './Select.module.css';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
  className = '',
  ...props
}, ref) => {
  const selectClasses = [
    styles.select,
    error && styles.error,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.selectWrapper}>
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className={styles.selectIcon} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </div>
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});
