import React, { useState, useRef, useEffect } from 'react';
import styles from './TableFilterDropdown.module.css';

interface TableFilterDropdownProps {
  columnKey: string;
  columnLabel: string;
  options: Array<{ value: string; label: string; count?: number }>;
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

export const TableFilterDropdown: React.FC<TableFilterDropdownProps> = ({
  columnKey,
  columnLabel,
  options,
  selectedValues,
  onFilterChange,
  onClose,
  position
}) => {
  const [localSelectedValues, setLocalSelectedValues] = useState<string[]>(selectedValues);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleOptionToggle = (value: string) => {
    setLocalSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSelectAll = () => {
    setLocalSelectedValues(options.map(option => option.value));
  };

  const handleClearAll = () => {
    setLocalSelectedValues([]);
  };

  const handleConfirm = () => {
    onFilterChange(localSelectedValues);
    onClose();
  };

  const handleCancel = () => {
    setLocalSelectedValues(selectedValues);
    onClose();
  };

  const handleClearFilter = () => {
    onFilterChange([]);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{columnLabel}筛选</h3>
        <button className={styles.closeButton} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleSelectAll}>
            全选({options.length})
          </button>
          <button className={styles.actionButton} onClick={handleClearAll}>
            清空
          </button>
        </div>

        <div className={styles.optionsList}>
          {options.map((option) => (
            <label key={option.value} className={styles.optionItem}>
              <input
                type="checkbox"
                checked={localSelectedValues.includes(option.value)}
                onChange={() => handleOptionToggle(option.value)}
                className={styles.checkbox}
              />
              <span className={styles.optionLabel}>
                {option.label}
                {option.count !== undefined && (
                  <span className={styles.count}>({option.count})</span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.clearFilterButton} onClick={handleClearFilter}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
          </svg>
          清除筛选
        </button>
        <div className={styles.confirmButtons}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            取消
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            确认
          </button>
        </div>
      </div>
    </div>
  );
}; 