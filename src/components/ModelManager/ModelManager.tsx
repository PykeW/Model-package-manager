/**
 * ModelManager组件 - 模型管理器主容器
 */

import React, { useState } from 'react';
import type { Model, ModelSort } from '../../types';
import { useModelTable } from '../../hooks/useModelTable';
import { ModelTable } from '../ModelTable';
import { ModelFilter } from './ModelFilter';
import { ModelStats } from './ModelStats';
import { Button } from '../UI';
import styles from './ModelManager.module.css';

export interface ModelManagerProps {
  models: Model[];
  className?: string;
}

export const ModelManager: React.FC<ModelManagerProps> = ({
  models,
  className = ''
}) => {
  const [loading] = useState(false);
  // const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // 使用自定义Hook管理表格状态
  const {
    filteredModels,
    filter,
    sort,
    setFilter,
    setSort,
    resetFilter,
    searchTerm,
    setSearchTerm
  } = useModelTable({ models });

  const handleRowClick = (model: Model) => {
    // setSelectedModel(model);
    console.log('Selected model:', model);
  };

  const handleSortChange = (newSort: ModelSort | null) => {
    setSort(newSort);
  };

  return (
    <div className={[styles.modelManager, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>模型管理器</h1>
          <p className={styles.subtitle}>管理和展示AI分割模型和检测模型</p>
        </div>
        <div className={styles.actions}>
          <Button variant="primary">添加模型</Button>
          <Button variant="secondary">导入模型</Button>
          <Button variant="ghost">导出数据</Button>
        </div>
      </header>

      <div className={styles.statsSection}>
        <ModelStats
          models={models}
          filteredModels={filteredModels}
          className={styles.stats}
        />
      </div>

      <div className={styles.filterSection}>
        <ModelFilter
          filter={filter}
          onFilterChange={setFilter}
          onReset={resetFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          className={styles.filter}
        />
      </div>

      <div className={styles.tableSection}>
        <ModelTable
          models={filteredModels}
          loading={loading}
          onRowClick={handleRowClick}
          onSort={handleSortChange}
          currentSort={sort}
          className={styles.table}
        />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span className={styles.footerText}>
            共 {models.length} 个模型，当前显示 {filteredModels.length} 个
          </span>
          <div className={styles.footerActions}>
            <Button variant="ghost" size="small">帮助</Button>
            <Button variant="ghost" size="small">设置</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};
