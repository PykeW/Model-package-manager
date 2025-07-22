/**
 * ModelTable组件 - 模型表格展示
 */

import React from 'react';
import type { Model, ModelSort, TableColumn } from '../../types';
import { Table, Tag } from '../UI';
import { formatFileSize, formatRelativeTime } from '../../utils';
import styles from './ModelTable.module.css';

export interface ModelTableProps {
  models: Model[];
  loading?: boolean;
  onRowClick?: (model: Model) => void;
  onSort?: (sort: ModelSort | null) => void;
  currentSort?: ModelSort | null;
  className?: string;
}

export const ModelTable: React.FC<ModelTableProps> = ({
  models,
  loading = false,
  onRowClick,
  onSort,
  currentSort,
  className = ''
}) => {
  // 定义表格列
  const columns: TableColumn<Model>[] = [
    {
      key: 'index',
      label: '序号',
      width: '60px',
      align: 'center',
      render: (_, __, index) => (
        <span className={styles.indexCell}>
          {String(index + 1).padStart(2, '0')}
        </span>
      )
    },
    {
      key: 'name',
      label: '模型名称',
      sortable: true,
      width: '200px',
      render: (value, model) => (
        <div className={styles.nameCell}>
          <span className={styles.modelName}>{value}</span>
          <span className={styles.modelVersion}>{model.version}</span>
        </div>
      )
    },
    {
      key: 'type',
      label: '类型',
      sortable: true,
      width: '100px',
      render: (value) => (
        <Tag
          label={value === 'segmentation' ? '分割模型' : '检测模型'}
          color={value === 'segmentation' ? 'primary' : 'secondary'}
        />
      )
    },

    {
      key: 'size',
      label: '大小',
      sortable: true,
      width: '100px',
      align: 'right',
      render: (_, model) => (
        <span className={styles.sizeCell}>
          {formatFileSize(model.metadata.size)}
        </span>
      )
    },
    {
      key: 'timestamp',
      label: '更新时间',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className={styles.timeCell}>
          {formatRelativeTime(value)}
        </span>
      )
    },
    {
      key: 'tags',
      label: '标签',
      width: '200px',
      render: (value: string[]) => (
        <div className={styles.tagsCell}>
          {value.slice(0, 2).map((tag, index) => (
            <Tag
              key={index}
              label={tag}
              color="secondary"
              className={styles.tag}
            />
          ))}
          {value.length > 2 && (
            <span className={styles.moreTagsIndicator}>
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    }
  ];

  const handleSort = (column: TableColumn<Model>) => {
    if (!column.sortable || !onSort) return;

    let newSort: ModelSort | null = null;

    if (!currentSort || currentSort.field !== column.key) {
      // 新字段排序，默认升序
      newSort = { field: column.key as keyof Model, direction: 'asc' };
    } else if (currentSort.direction === 'asc') {
      // 当前升序，切换到降序
      newSort = { field: column.key as keyof Model, direction: 'desc' };
    }
    // 当前降序，取消排序（newSort 保持 null）

    onSort(newSort);
  };

  // 增强表格列，添加排序处理
  const enhancedColumns = columns.map(column => ({
    ...column,
    render: column.render || ((value: any) => value),
    onClick: column.sortable ? () => handleSort(column) : undefined
  }));

  const handleRowClick = (model: Model) => {
    if (onRowClick) {
      onRowClick(model);
    }
  };

  return (
    <div className={[styles.modelTable, className].filter(Boolean).join(' ')}>
      <Table
        data={models}
        columns={enhancedColumns}
        loading={loading}
        onRowClick={handleRowClick}
        emptyMessage="暂无模型数据"
        className={styles.table}
      />
    </div>
  );
};
