/**
 * Table组件 - 工业风格表格
 */

import { useState, useRef, useCallback } from 'react';
import type { TableProps } from '../../../types';
import styles from './Table.module.css';

export const Table = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = '暂无数据',
  onRowClick,
  className = '',
  ...props
}: TableProps<T>) => {
  const [isResizing, setIsResizing] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const resizingRef = useRef<{
    columnIndex: number;
    startX: number;
    startWidth: number;
    nextWidth: number;
  } | null>(null);

  const tableClasses = [
    styles.table,
    loading && styles.loading,
    isResizing && styles.resizing,
    className
  ].filter(Boolean).join(' ');

  const handleRowClick = (row: T, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current || !tableRef.current) return;

    const { columnIndex, startX, startWidth, nextWidth } = resizingRef.current;
    const deltaX = e.clientX - startX;
    
    const newCurrentWidth = Math.max(50, startWidth + deltaX);
    const newNextWidth = Math.max(50, nextWidth - deltaX);
    
    const headerCells = tableRef.current.querySelectorAll('th');
    const currentCell = headerCells[columnIndex] as HTMLElement;
    const nextCell = headerCells[columnIndex + 1] as HTMLElement;
    
    if (currentCell && nextCell) {
      currentCell.style.width = `${newCurrentWidth}px`;
      nextCell.style.width = `${newNextWidth}px`;
    }
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizingRef.current = null;
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleResizeMove]);

  const handleResizeStart = useCallback((e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    
    if (!tableRef.current) return;
    
    const headerCells = tableRef.current.querySelectorAll('th');
    const currentCell = headerCells[columnIndex] as HTMLElement;
    const nextCell = headerCells[columnIndex + 1] as HTMLElement;
    
    if (!currentCell || !nextCell) return;

    resizingRef.current = {
      columnIndex,
      startX: e.clientX,
      startWidth: currentCell.offsetWidth,
      nextWidth: nextCell.offsetWidth,
    };

    setIsResizing(true);
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [handleResizeMove, handleResizeEnd]);

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
      
      <table ref={tableRef} className={tableClasses} {...props}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((column, index) => (
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
                {index < columns.length - 1 && (
                  <div
                    className={styles.resizeHandle}
                    onMouseDown={(e) => handleResizeStart(e, index)}
                  />
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
                onClick={onRowClick ? () => handleRowClick(row, rowIndex) : undefined}
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
                      : String(row[column.key] ?? '')}
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
