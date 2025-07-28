/**
 * ModelAssociationPanel - 模型关联选择面板
 * 允许用户从现有模型中选择部分模型与当前运行方案进行关联
 */

import React, { useState, useMemo } from 'react';
import type { ModelAssociationPanelProps, ModelSelectionState, Model, ModelAssociationType } from '../../types';
import { Button, Input, Tag } from '../UI';
import styles from './ModelAssociationPanel.module.css';

export const ModelAssociationPanel: React.FC<ModelAssociationPanelProps> = ({
  currentScheme,
  availableModels,
  associatedModels,
  onAssociate,
  onDisassociate,
  onUpdatePriority,
  onBack,
  loading = false
}) => {
  // 选择状态管理
  const [selectionState, setSelectionState] = useState<ModelSelectionState>({
    selectedModels: new Set<string>(),
    selectAll: false,
    bulkPriority: 5
  });

  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('');

  // 获取已关联的模型ID集合
  const associatedModelIds = useMemo(() => 
    new Set(associatedModels.map(a => a.modelId)), 
    [associatedModels]
  );

  // 筛选可用模型
  const filteredModels = useMemo(() => {
    return availableModels.filter(model => {
      const matchesSearch = searchTerm === '' || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === '' || model.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [availableModels, searchTerm, filterType]);

  // 处理单个模型选择
  const handleModelSelect = (modelId: string, isSelected: boolean) => {
    const newSelected = new Set(selectionState.selectedModels);
    if (isSelected) {
      newSelected.add(modelId);
    } else {
      newSelected.delete(modelId);
    }
    
    setSelectionState(prev => ({
      ...prev,
      selectedModels: newSelected,
      selectAll: newSelected.size === filteredModels.length
    }));
  };

  // 处理全选/取消全选
  const handleSelectAll = (selectAll: boolean) => {
    if (selectAll) {
      setSelectionState(prev => ({
        ...prev,
        selectedModels: new Set(filteredModels.map(m => m.id)),
        selectAll: true
      }));
    } else {
      setSelectionState(prev => ({
        ...prev,
        selectedModels: new Set(),
        selectAll: false
      }));
    }
  };

  // 批量关联模型
  const handleBatchAssociate = () => {
    const selectedIds = Array.from(selectionState.selectedModels);
    if (selectedIds.length > 0) {
      onAssociate(selectedIds, selectionState.bulkPriority);
      // 清空选择
      setSelectionState(prev => ({
        ...prev,
        selectedModels: new Set(),
        selectAll: false
      }));
    }
  };

  // 批量取消关联
  const handleBatchDisassociate = () => {
    const selectedIds = Array.from(selectionState.selectedModels);
    const associatedSelected = selectedIds.filter(id => associatedModelIds.has(id));
    if (associatedSelected.length > 0) {
      onDisassociate(associatedSelected);
      // 清空选择
      setSelectionState(prev => ({
        ...prev,
        selectedModels: new Set(),
        selectAll: false
      }));
    }
  };

  // 单个模型关联/取消关联
  const handleToggleAssociation = (model: Model) => {
    if (associatedModelIds.has(model.id)) {
      onDisassociate([model.id]);
    } else {
      onAssociate([model.id], 5);
    }
  };

  // 获取模型的关联信息
  const getModelAssociation = (modelId: string): ModelAssociationType | undefined => {
    return associatedModels.find(a => a.modelId === modelId);
  };

  return (
    <div className={styles.container}>
      {/* 头部区域 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button 
            variant="ghost" 
            onClick={onBack}
            className={styles.backButton}
          >
            ← 返回模型管理
          </Button>
          <div className={styles.titleSection}>
            <h2 className={styles.title}>模型关联配置</h2>
            <p className={styles.subtitle}>为运行方案选择和配置AI模型</p>
          </div>
        </div>
      </header>

      {/* 当前方案信息 */}
      <section className={styles.schemeInfo}>
        <div className={styles.schemeCard}>
          <div className={styles.schemeHeader}>
            <h3 className={styles.schemeName}>{currentScheme.name}</h3>
            <div className={styles.schemeStatus}>
              {currentScheme.isActive && (
                <Tag label="当前活跃方案" color="success" />
              )}
              <Tag label={currentScheme.category || ''} color="primary" />
            </div>
          </div>
          <p className={styles.schemeDescription}>{currentScheme.description}</p>
          <div className={styles.schemeStats}>
            <span className={styles.statItem}>
              已关联模型: <strong>{associatedModels.filter(a => a.isEnabled).length}</strong>
            </span>
            <span className={styles.statItem}>
              方案优先级: <strong>{currentScheme.priority}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 搜索和筛选区域 */}
      <section className={styles.searchSection}>
        <div className={styles.searchControls}>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="搜索模型名称或标签..."
            type="search"
            className={styles.searchInput}
          />
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.typeFilter}
          >
            <option value="">全部类型</option>
            <option value="segmentation">分割模型</option>
            <option value="detection">检测模型</option>
          </select>
        </div>

        {/* 批量操作控制 */}
        <div className={styles.bulkControls}>
          <label className={styles.selectAllLabel}>
            <input
              type="checkbox"
              checked={selectionState.selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className={styles.selectAllCheckbox}
            />
            全选 ({selectionState.selectedModels.size}/{filteredModels.length})
          </label>
          
          <div className={styles.bulkActions}>
            <input
              type="number"
              min="1"
              max="10"
              value={selectionState.bulkPriority}
              onChange={(e) => setSelectionState(prev => ({
                ...prev, 
                bulkPriority: parseInt(e.target.value) || 5
              }))}
              className={styles.priorityInput}
              placeholder="优先级"
            />
            <Button
              onClick={handleBatchAssociate}
              disabled={selectionState.selectedModels.size === 0}
              variant="primary"
              size="small"
            >
              批量关联 ({selectionState.selectedModels.size})
            </Button>
            <Button
              onClick={handleBatchDisassociate}
              disabled={selectionState.selectedModels.size === 0}
              variant="danger"
              size="small"
            >
              批量取消
            </Button>
          </div>
        </div>
      </section>

      {/* 模型列表 */}
      <section className={styles.modelList}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>可用模型 ({filteredModels.length})</h3>
        </div>
        
        <div className={styles.modelGrid}>
          {filteredModels.map(model => {
            const isAssociated = associatedModelIds.has(model.id);
            const association = getModelAssociation(model.id);
            const isSelected = selectionState.selectedModels.has(model.id);
            
            return (
              <div 
                key={model.id} 
                className={`${styles.modelCard} ${isAssociated ? styles.associated : ''} ${isSelected ? styles.selected : ''}`}
              >
                <div className={styles.modelCardHeader}>
                  <label className={styles.modelSelectLabel}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleModelSelect(model.id, e.target.checked)}
                      className={styles.modelCheckbox}
                    />
                    <span className={styles.modelName}>{model.name}</span>
                  </label>
                  <div className={styles.modelStatus}>
                    {isAssociated && (
                      <Tag 
                        label={association?.isEnabled ? "已关联" : "已禁用"}
                        color={association?.isEnabled ? "success" : "warning"}
                      />
                    )}
                    <Tag 
                      label={model.type === 'segmentation' ? '分割' : '检测'}
                      color={model.type === 'segmentation' ? 'primary' : 'secondary'}
                    />
                  </div>
                </div>
                
                <div className={styles.modelInfo}>
                  <div className={styles.modelMeta}>
                    <span>版本: {model.version}</span>
                    <span>大小: {Math.round(model.metadata.size / 1024 / 1024)}MB</span>
                    <span>准确率: {(model.metadata.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.modelTags}>
                    {model.tags.slice(0, 3).map(tag => (
                      <Tag 
                        key={tag} 
                        label={tag}
                        color="secondary" 
                        className={styles.modelTag}
                      />
                    ))}
                    {model.tags.length > 3 && (
                      <span className={styles.moreTags}>+{model.tags.length - 3}</span>
                    )}
                  </div>

                  {isAssociated && association && (
                    <div className={styles.associationInfo}>
                      <div className={styles.priorityInfo}>
                        优先级: 
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={association.priority}
                          onChange={(e) => onUpdatePriority(model.id, parseInt(e.target.value) || 5)}
                          className={styles.priorityInput}
                        />
                      </div>
                      {association.config?.notes && (
                        <p className={styles.associationNotes}>{association.config.notes}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className={styles.modelActions}>
                  <Button
                    onClick={() => handleToggleAssociation(model)}
                    variant={isAssociated ? "danger" : "primary"}
                    size="small"
                    disabled={loading}
                  >
                    {isAssociated ? "取消关联" : "关联模型"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredModels.length === 0 && (
          <div className={styles.emptyState}>
            <p>没有找到匹配的模型</p>
            <Button onClick={() => setSearchTerm('')} variant="ghost">
              清空搜索条件
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}; 