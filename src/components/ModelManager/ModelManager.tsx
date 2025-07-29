/**
 * ModelManager组件 - 模型管理器主容器
 */

import React, { useState } from 'react';
import type { Model, ModelSort, ModelAssociationType } from '../../types';
import { useModelTable } from '../../hooks/useModelTable';
import { ModelTable } from '../ModelTable';
import { ModelFilter } from './ModelFilter';
import { ModelAssociationPanel } from '../ModelAssociation';
import { Button } from '../UI';
import { getCurrentActiveScheme, getAssociationsBySchemeId, mockModelAssociations } from '../../data/mockSchemes';
import styles from './ModelManager.module.css';

export interface ModelManagerProps {
  models: Model[];
  className?: string;
  showHeader?: boolean;
  onAddModel?: () => void;
}

export const ModelManager: React.FC<ModelManagerProps> = ({
  models,
  className = '',
  showHeader = true,
  onAddModel
}) => {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'association'>('main');
  const [associations, setAssociations] = useState<ModelAssociationType[]>(mockModelAssociations);

  // 获取当前活跃方案
  const currentScheme = getCurrentActiveScheme();

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
    console.log('Selected model:', model);
  };

  const handleSortChange = (newSort: ModelSort | null) => {
    setSort(newSort);
  };

  // 导航到模型关联页面
  const handleGoToAssociation = () => {
    setCurrentPage('association');
  };

  // 返回主页面
  const handleBackToMain = () => {
    setCurrentPage('main');
  };

  // 处理模型关联
  const handleAssociate = (modelIds: string[], priority: number = 5) => {
    if (!currentScheme) return;
    
    const newAssociations: ModelAssociationType[] = modelIds.map(modelId => ({
      modelId,
      schemeId: currentScheme.id,
      priority,
      associatedAt: new Date().toISOString(),
      isEnabled: true,
      config: {
        weight: 0.7,
        threshold: 0.75,
        notes: '手动关联的模型'
      }
    }));

    setAssociations(prev => [
      ...prev.filter(a => !modelIds.includes(a.modelId) || a.schemeId !== currentScheme.id),
      ...newAssociations
    ]);
  };

  // 处理模型取消关联
  const handleDisassociate = (modelIds: string[]) => {
    if (!currentScheme) return;
    
    setAssociations(prev => 
      prev.filter(a => !(modelIds.includes(a.modelId) && a.schemeId === currentScheme.id))
    );
  };

  // 处理优先级更新
  const handleUpdatePriority = (modelId: string, priority: number) => {
    if (!currentScheme) return;
    
    setAssociations(prev => 
      prev.map(a => 
        a.modelId === modelId && a.schemeId === currentScheme.id
          ? { ...a, priority }
          : a
      )
    );
  };

  // 单个模型关联处理函数
  const handleSingleAssociate = (modelId: string) => {
    handleAssociate([modelId], 5);
  };

  // 单个模型取消关联处理函数
  const handleSingleDisassociate = (modelId: string) => {
    handleDisassociate([modelId]);
  };

  // 如果显示模型关联子页面
  if (currentPage === 'association') {
    if (!currentScheme) {
      return (
        <div className={[styles.modelManager, className].filter(Boolean).join(' ')}>
          <div className={styles.errorMessage}>
            <p>没有找到当前活跃的运行方案</p>
            <Button onClick={handleBackToMain} variant="primary">
              返回模型管理
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className={[styles.modelManager, className].filter(Boolean).join(' ')}>
        <ModelAssociationPanel
          currentScheme={currentScheme}
          availableModels={models}
          associatedModels={associations.filter(a => a.schemeId === currentScheme.id)}
          onAssociate={handleAssociate}
          onDisassociate={handleDisassociate}
          onUpdatePriority={handleUpdatePriority}
          onBack={handleBackToMain}
          loading={loading}
        />
      </div>
    );
  }

  // 默认显示主页面
  return (
    <div className={[styles.modelManager, className].filter(Boolean).join(' ')}>
      {showHeader && (
        <header className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>模型管理器</h1>
            <p className={styles.subtitle}>管理和展示AI分割模型和检测模型</p>
          </div>
          <div className={styles.actions}>
            <Button 
              variant="secondary"
              onClick={onAddModel}
            >
              导入模型
            </Button>
            <Button variant="ghost">导出数据</Button>
          </div>
        </header>
      )}

      {/* 操作按钮区域 */}
      <div className={styles.actionBar}>
        <div className={styles.actionButtons}>
          <Button 
            variant="secondary" 
            size="small"
            onClick={onAddModel}
          >
            导入模型
          </Button>
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => {
              console.log('打开模型文件夹');
              // 模拟打开文件夹操作
              if (window.confirm('是否打开模型存储文件夹？\n路径: C:\\AI_Models\\Storage')) {
                console.log('打开文件夹: C:\\AI_Models\\Storage');
              }
            }}
          >
            📁 打开模型文件夹
          </Button>
        </div>
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
          showAssociationActions={true}
          associations={associations}
          onAssociate={handleSingleAssociate}
          onDisassociate={handleSingleDisassociate}
        />
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.topRow}>
            <div className={styles.statusInfo}>
              <span className={styles.modelCount}>
                共 {models.length} 个模型，当前显示 {filteredModels.length} 个
              </span>
            </div>
            <div className={styles.footerActions}>
              <Button variant="ghost" size="small">帮助</Button>
              <Button variant="ghost" size="small">设置</Button>
            </div>
          </div>
          
          {currentScheme && (
            <div className={styles.schemePanel}>
              <div className={styles.schemeInfo}>
                <div className={styles.schemeHeader}>
                  <span className={styles.schemeLabel}>当前方案</span>
                  <span className={`${styles.schemeStatus} ${!currentScheme.isActive ? styles.inactive : ''}`}>
                    {currentScheme.isActive ? '● 运行中' : '○ 停用'}
                  </span>
                </div>
                <div className={styles.schemeName}>{currentScheme.name}</div>
                <div className={styles.schemeStats}>
                  已关联: <strong>{getAssociationsBySchemeId(currentScheme.id).filter(a => a.isEnabled).length}</strong> 个模型
                  {' | '}优先级: <strong>{currentScheme.priority}</strong>
                </div>
              </div>
              <div className={styles.schemeActions}>
                <Button 
                  variant="primary" 
                  size="small"
                  onClick={handleGoToAssociation}
                >
                  管理关联
                </Button>
                <Button variant="ghost" size="small">
                  方案设置
                </Button>
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
