/**
 * Tag组件 - 工业风格标签
 */

import React from 'react';
import type { TagProps } from '../../../types';
import styles from './Tag.module.css';

export const Tag: React.FC<TagProps> = ({
  label,
  color = 'primary',
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  const tagClasses = [
    styles.tag,
    styles[color],
    removable && styles.removable,
    className
  ].filter(Boolean).join(' ');

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span className={tagClasses} {...props}>
      <span className={styles.label}>{label}</span>
      {removable && (
        <button
          type="button"
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label={`移除标签 ${label}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
};
