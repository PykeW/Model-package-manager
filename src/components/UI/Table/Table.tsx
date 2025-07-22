/**
 * Table组件 - 工业风格表格
 */

import type { TableProps } from '../../../types';
import styles from './Table.module.css';

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = '暂无数据',
  onRowClick,
  className = '',
  ...props
}: TableProps<T>) => {
  const tableClasses = [
    styles.table,
    loading && styles.loading,
    className
  ].filter(Boolean).join(' ');

  const handleRowClick = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  return (
    <div className={styles.tableWrapper}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="32"
              />
            </svg>
          </div>
          <span className={styles.loadingText}>加载中...</span>
        </div>
      )}
      
      <table className={tableClasses} {...props}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={[
                  styles.tableHeaderCell,
                  column.sortable && styles.sortable,
                  column.align && styles[`align-${column.align}`]
                ].filter(Boolean).join(' ')}
                style={{ width: column.width }}
              >
                {column.label}
                {column.sortable && (
                  <span className={styles.sortIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
                    </svg>
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className={styles.tableBody}>
          {data.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td colSpan={columns.length} className={styles.emptyCell}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={styles.tableRow}
                onClick={() => handleRowClick(row, rowIndex)}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className={[
                      styles.tableCell,
                      column.align && styles[`align-${column.align}`]
                    ].filter(Boolean).join(' ')}
                  >
                    {column.render
                      ? column.render(row[column.key], row, rowIndex)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
