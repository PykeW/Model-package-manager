/**
 * Table组件 - 工业风格表格
 */

import { useState, useRef, useCallback } from 'react';
import type { TableProps } from '../../../types';
import { TableFilterDropdown } from './TableFilterDropdown';
import styles from './Table.module.css';

export const Table = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = '暂无数据',
  onRowClick,
  onFilter,
  className = '',
  ...props
}: TableProps<T>) => {
  const [isResizing, setIsResizing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [filterDropdown, setFilterDropdown] = useState<{
    columnKey: string;
    columnLabel: string;
    position: { x: number; y: number };
  } | null>(null);
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

  const handleFilterClick = (columnKey: string, event: React.MouseEvent) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left,
      y: rect.bottom + 2
    };

    setFilterDropdown({
      columnKey,
      columnLabel: column.label,
      position
    });
    setActiveFilter(columnKey);
  };

  const handleFilterChange = (columnKey: string, values: string[]) => {
    if (onFilter) {
      onFilter(columnKey, values.join(','));
    }
  };

  const closeFilterDropdown = () => {
    setFilterDropdown(null);
    setActiveFilter(null);
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

  // 为类型列生成筛选选项
  const getFilterOptions = (columnKey: string) => {
    if (columnKey === 'type') {
      // 从原始数据中统计数量，而不是从当前筛选后的数据
      const allData = data; // 这里应该传入原始数据，暂时使用当前数据
      const segmentationCount = allData.filter(item => item[columnKey] === 'segmentation').length;
      const detectionCount = allData.filter(item => item[columnKey] === 'detection').length;
      
      return [
        { value: 'segmentation', label: '分割模型', count: segmentationCount },
        { value: 'detection', label: '检测模型', count: detectionCount }
      ];
    }
    return [];
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
      
      {filterDropdown && (
        <TableFilterDropdown
          columnKey={filterDropdown.columnKey}
          columnLabel={filterDropdown.columnLabel}
          options={getFilterOptions(filterDropdown.columnKey)}
          selectedValues={[]}
          onFilterChange={(values) => handleFilterChange(filterDropdown.columnKey, values)}
          onClose={closeFilterDropdown}
          position={filterDropdown.position}
        />
      )}
      
      <table ref={tableRef} className={tableClasses} {...props}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={[
                  styles.tableHeaderCell,
                  (column.sortable || column.filterable) && styles.sortable,
                  column.align && styles[`align-${column.align}`]
                ].filter(Boolean).join(' ')}
                style={{ 
                  width: column.width,
                  minWidth: column.minWidth
                }}
              >
                {column.label}
                {column.sortable && (
                  <span className={styles.sortIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
                    </svg>
                  </span>
                )}
                {column.filterable && (
                  <span 
                    className={`${styles.filterIcon} ${activeFilter === column.key ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterClick(column.key, e);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
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
