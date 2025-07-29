/**
 * ModelFilter组件 - 模型筛选器
 */

import React from 'react';
import type { ModelFilter as ModelFilterType, ModelType, ModelStatus } from '../../types';
import { Input, Select, Button } from '../UI';
import styles from './ModelFilter.module.css';

export interface ModelFilterProps {
  filter: ModelFilterType;
  onFilterChange: (filter: ModelFilterType) => void;
  onReset: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  className?: string;
  onAddModel?: () => void;
  onOpenFolder?: () => void;
}

export const ModelFilter: React.FC<ModelFilterProps> = ({
  filter,
  onFilterChange,
  onReset,
  searchTerm,
  onSearchChange,
  className = '',
  onAddModel,
  onOpenFolder
}) => {
  const handleTypeChange = (value: string) => {
    onFilterChange({
      ...filter,
      type: value ? value as ModelType : undefined
    });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filter,
      status: value ? value as ModelStatus : undefined
    });
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };

  const typeOptions = [
    { value: '', label: '全部类型' },
    { value: 'segmentation', label: '分割模型' },
    { value: 'detection', label: '检测模型' }
  ];

  const statusOptions = [
    { value: '', label: '全部状态' },
    { value: 'active', label: '活跃' },
    { value: 'archived', label: '归档' },
    { value: 'deprecated', label: '废弃' }
  ];

  return (
    <div className={[styles.filterContainer, className].filter(Boolean).join(' ')}>
      <div className={styles.searchContainer}>
        <Input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="搜索模型名称、描述或标签..."
          type="search"
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>模型类型</label>
          <Select
            value={filter.type || ''}
            onChange={handleTypeChange}
            options={typeOptions}
            className={styles.filterSelect}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>状态</label>
          <Select
            value={filter.status || ''}
            onChange={handleStatusChange}
            options={statusOptions}
            className={styles.filterSelect}
          />
        </div>
        
        <Button
          onClick={onReset}
          variant="ghost"
          size="small"
          className={styles.resetButton}
        >
          重置
        </Button>
        
        {onAddModel && (
          <Button
            onClick={onAddModel}
            variant="secondary"
            size="small"
            className={styles.actionButton}
          >
            导入模型
          </Button>
        )}
        
        {onOpenFolder && (
          <Button
            onClick={onOpenFolder}
            variant="ghost"
            size="small"
            className={styles.actionButton}
          >
            📁 打开文件夹
          </Button>
        )}
      </div>
    </div>
  );
};
