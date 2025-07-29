import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Table } from './Table';
import type { TableColumn, TableProps } from '../../../types';
import styles from './ResizableTable.module.css';

interface ResizableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

export function ResizableTable<T>({ columns, data, onRowClick, className }: ResizableTableProps<T>) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const tableRef = useRef<HTMLTableElement>(null);
  const resizingRef = useRef<{
    columnKey: string;
    startX: number;
    startWidth: number;
    nextWidth: number;
  } | null>(null);

  // 初始化列宽
  useEffect(() => {
    if (tableRef.current && Object.keys(columnWidths).length === 0) {
      const table = tableRef.current;
      const headerCells = table.querySelectorAll('th');
      const initialWidths: Record<string, number> = {};
      
      headerCells.forEach((cell, index) => {
        if (columns[index]) {
          const rect = cell.getBoundingClientRect();
          initialWidths[columns[index].key] = rect.width;
        }
      });
      
      setColumnWidths(initialWidths);
    }
  }, [columns, columnWidths]);

  const handleMouseDown = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    
    const currentIndex = columns.findIndex(col => col.key === columnKey);
    const nextColumn = columns[currentIndex + 1];
    
    if (!nextColumn || !tableRef.current) return;

    const table = tableRef.current;
    const headerCells = table.querySelectorAll('th');
    const currentCell = headerCells[currentIndex] as HTMLElement;
    const nextCell = headerCells[currentIndex + 1] as HTMLElement;

    if (!currentCell || !nextCell) return;

    resizingRef.current = {
      columnKey,
      startX: e.clientX,
      startWidth: currentCell.offsetWidth,
      nextWidth: nextCell.offsetWidth,
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [columns]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return;

    const { columnKey, startX, startWidth, nextWidth } = resizingRef.current;
    const deltaX = e.clientX - startX;
    
    const newCurrentWidth = Math.max(50, startWidth + deltaX);
    const newNextWidth = Math.max(50, nextWidth - deltaX);
    
    const currentIndex = columns.findIndex(col => col.key === columnKey);
    const nextColumn = columns[currentIndex + 1];
    
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: newCurrentWidth,
      [nextColumn.key]: newNextWidth,
    }));
  }, [columns]);

  const handleMouseUp = useCallback(() => {
    resizingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  // 创建增强的列定义
  const enhancedColumns = columns.map((column, index) => ({
    ...column,
    width: columnWidths[column.key] ? `${columnWidths[column.key]}px` : column.width,
    headerRender: (label: string) => (
      <div className={styles.headerCell}>
        <span className={styles.headerLabel}>{label}</span>
        {index < columns.length - 1 && (
          <div
            className={styles.resizeHandle}
            onMouseDown={(e) => handleMouseDown(e, column.key)}
          />
        )}
      </div>
    ),
  }));

  return (
    <div className={`${styles.resizableTableContainer} ${className || ''}`}>
      <Table
        ref={tableRef}
        columns={enhancedColumns}
        data={data}
        onRowClick={onRowClick}
      />
    </div>
  );
} 