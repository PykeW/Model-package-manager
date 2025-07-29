/**
 * ModelManager组件 - 模型管理器主容器
 */

import React, { useState } from 'react';
import type { Model, ModelSort, ModelAssociationType } from '../../types';
import { useModelTable } from '../../hooks/useModelTable';
import { ModelTable } from '../ModelTable';
import { ModelFilter } from './ModelFilter';

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
  const [associations, setAssociations] = useState<ModelAssociationType[]>(mockModelAssociations);
  // 新增：视图模式状态
  const [viewMode, setViewMode] = useState<'all' | 'associated'>('all');
  // 新增：方案保存状态
  const [isSaving, setIsSaving] = useState(false);

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

  // 根据视图模式过滤模型
  const viewFilteredModels = React.useMemo(() => {
    if (viewMode === 'associated' && currentScheme) {
      const associatedModelIds = new Set(
        associations
          .filter(a => a.schemeId === currentScheme.id && a.isEnabled)
          .map(a => a.modelId)
      );
      return filteredModels.filter(model => associatedModelIds.has(model.id));
    }
    return filteredModels;
  }, [filteredModels, viewMode, associations, currentScheme]);

  const handleRowClick = (model: Model) => {
    console.log('Selected model:', model);
  };

  const handleSortChange = (newSort: ModelSort | null) => {
    setSort(newSort);
  };

  // 切换关联模型视图
  const handleToggleAssociationView = () => {
    setViewMode(viewMode === 'associated' ? 'all' : 'associated');
  };

  // 新增：切换方案功能
  const handleSwitchScheme = () => {
    alert('即将跳转到方案管理器...');
    // 这里可以添加实际的跳转逻辑
    console.log('跳转到方案管理器');
  };

  // 新增：保存方案功能
  const handleSaveScheme = async () => {
    if (!currentScheme) return;
    
    setIsSaving(true);
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存方案:', currentScheme.name);
      alert('方案保存成功！');
    } catch (error) {
      console.error('保存方案失败:', error);
      alert('保存方案失败，请重试。');
    } finally {
      setIsSaving(false);
    }
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



  // 单个模型关联处理函数
  const handleSingleAssociate = (modelId: string) => {
    handleAssociate([modelId], 5);
  };

  // 单个模型取消关联处理函数
  const handleSingleDisassociate = (modelId: string) => {
    handleDisassociate([modelId]);
  };

  // 主页面渲染
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
            <Button 
              variant="ghost"
              onClick={() => {
                console.log('打开模型文件夹');
                // 模拟打开文件夹操作
                if (window.confirm('是否打开模型存储文件夹？\n路径: C:\\AI_Models\\Storage')) {
                  console.log('打开文件夹: C:\\AI_Models\\Storage');
                }
              }}
            >
              📁 打开文件夹
            </Button>
            <Button variant="ghost">导出数据</Button>
          </div>
        </header>
      )}

      <div className={styles.filterSection}>
        <ModelFilter
          filter={filter}
          onFilterChange={setFilter}
          onReset={resetFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          className={styles.filter}
          onAddModel={onAddModel}
          onOpenFolder={() => {
            console.log('打开模型文件夹');
            // 模拟打开文件夹操作
            if (window.confirm('是否打开模型存储文件夹？\n路径: C:\\AI_Models\\Storage')) {
              console.log('打开文件夹: C:\\AI_Models\\Storage');
            }
          }}
        />
      </div>

      <div className={styles.tableSection}>
        <ModelTable
          models={viewFilteredModels}
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
        <span className={styles.modelCount}>
          {viewMode === 'associated' 
            ? `已关联模型：${viewFilteredModels.length} 个` 
            : `共 ${models.length} 个模型，当前显示 ${viewFilteredModels.length} 个`
          }
        </span>
        
        {currentScheme && (
          <div className={styles.schemePanel}>
            <div className={styles.schemeInfo}>
              <span className={styles.schemeLabel}>当前方案</span>
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
                onClick={handleToggleAssociationView}
              >
                {viewMode === 'associated' ? '显示全部' : '管理关联'}
              </Button>
              <Button 
                variant="ghost" 
                size="small"
                onClick={handleSwitchScheme}
              >
                切换方案
              </Button>
              <Button 
                variant="secondary" 
                size="small"
                onClick={handleSaveScheme}
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存方案'}
              </Button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
