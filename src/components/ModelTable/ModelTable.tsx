/**
 * ModelTable组件 - 模型表格展示
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { Model, ModelSort, TableColumn, ModelAssociationType } from '../../types';
import { Table, Tag, Tooltip } from '../UI';
import { formatFileSize, formatDate } from '../../utils';
import { parseVersion } from '../../utils/versionGenerator';
import { ModelPreview } from './ModelPreview';
import styles from './ModelTable.module.css';

export interface ModelTableProps {
  models: Model[];
  loading?: boolean;
  onRowClick?: (model: Model) => void;
  onSort?: (sort: ModelSort | null) => void;
  currentSort?: ModelSort | null;
  className?: string;
  // 关联功能相关props
  showAssociationActions?: boolean;
  associations?: ModelAssociationType[];
  onAssociate?: (modelId: string) => void;
  onDisassociate?: (modelId: string) => void;
}

// 版本选项类型
interface VersionOption {
  value: string;
  label: string;
}

// 生成版本选项的函数
const generateVersionOptions = (model: Model): VersionOption[] => {
  const currentVersion = model.version;
  const parsed = parseVersion(currentVersion);
  
  if (!parsed) {
    // 如果不是新格式，返回当前版本
    return [{ value: currentVersion, label: currentVersion }];
  }
  
  const options: VersionOption[] = [];
  
  // 根据当前模型的实际基础模型来生成选项
  const { baseModel } = parsed;
  
  // 定义不同基础模型列表
  const baseModels = ['bisegnet', 'sam', 'YOLOv8', 'YOLOv11', 'unet', 'deeplab', 'maskrcnn', 'fasterrcnn'];
  
  // 生成8个版本选项
  for (let i = 1; i <= 8; i++) {
    let targetBaseModel: string;
    
    if (i <= 4) {
      // 前4个版本使用相同的基础模型
      targetBaseModel = baseModel;
    } else {
      // 后面的版本使用不同的基础模型
      const modelIndex = (i - 5) % baseModels.length;
      targetBaseModel = baseModels[modelIndex];
    }
    
    const version = `${targetBaseModel}_${i}`;
    options.push({
      value: version,
      label: version
    });
  }
  
  return options;
};

export const ModelTable: React.FC<ModelTableProps> = ({
  models,
  loading = false,
  onRowClick,
  onSort,
  currentSort,
  className = '',
  showAssociationActions = false,
  associations = [],
  onAssociate,
  onDisassociate
}) => {
  const [filteredModels, setFilteredModels] = useState<Model[]>(models);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [modelVersions, setModelVersions] = useState<Record<string, string>>({});
  
  // 检查模型是否已关联
  const isModelAssociated = useCallback((modelId: string): boolean => {
    return associations.some(assoc => assoc.modelId === modelId && assoc.isEnabled);
  }, [associations]);
  
  // 当models数据变化时，更新filteredModels和版本状态
  useEffect(() => {
    // 对模型进行排序：已关联的模型排在前面
    const sortedModels = [...models].sort((a, b) => {
      const aAssociated = isModelAssociated(a.id);
      const bAssociated = isModelAssociated(b.id);
      
      if (aAssociated && !bAssociated) return -1; // a已关联，b未关联，a排在前面
      if (!aAssociated && bAssociated) return 1;  // a未关联，b已关联，b排在前面
      return 0; // 都关联或都未关联，保持原有顺序
    });
    
    setFilteredModels(sortedModels);
    
    // 初始化每个模型的版本状态
    const initialVersions: Record<string, string> = {};
    models.forEach(model => {
      initialVersions[model.id] = model.version;
    });
    setModelVersions(initialVersions);
  }, [models, associations, isModelAssociated]);

  // 处理版本切换
  const handleVersionChange = (modelId: string, newVersion: string) => {
    setModelVersions(prev => ({
      ...prev,
      [modelId]: newVersion
    }));
    console.log('Version changed:', newVersion);
  };

  // 根据版本号生成训练完成时间
  const getTrainingCompletedAt = (version: string): Date => {
    const baseDate = new Date('2024-01-01T00:00:00');
    const parsed = parseVersion(version);
    if (!parsed) return baseDate;
    
    // 版本号越大，时间越晚（每个版本号增加1小时）
    const hoursToAdd = parsed.sequenceNumber * 60; // 每分钟增加
    return new Date(baseDate.getTime() + hoursToAdd * 60 * 1000);
  };


  // 定义表格列
  const columns: TableColumn<Model>[] = [
    {
      key: 'index',
      label: '序号',
      width: '5%',
      minWidth: '60px',
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
      width: '16%', /* 缩短模型名称列宽度 */
      minWidth: '160px', /* 缩短最小宽度 */
      render: (value: unknown, model: Model) => (
        <div className={styles.nameCell}>
          <span className={styles.modelName}>{String(value)}</span>
          <button
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Edit model:', model.name);
              // 这里可以添加编辑功能
            }}
            title="编辑模型名称"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      )
    },
    {
      key: 'type',
      label: '类型',
      filterable: true,
      width: '12%',
      minWidth: '120px',
              render: (value: unknown, model: Model) => {
          const versionValue = modelVersions[model.id] || model.version;
          const parsed = parseVersion(versionValue);
          const baseModel = parsed?.baseModel || 'unknown';
          const typeLabel = String(value) === 'segmentation' ? '分割' : '检测';
          
          return (
            <div className={styles.typeCell}>
              <Tag
                label={`${typeLabel}：${baseModel}`}
                color={String(value) === 'segmentation' ? 'primary' : 'secondary'}
              />
            </div>
          );
        }
    },
    {
      key: 'size',
      label: '大小',
      sortable: true,
      width: '8%',
      minWidth: '80px',
      render: (_, model: Model) => (
        <span className={styles.sizeCell}>
          {formatFileSize(model.metadata.size)}
        </span>
      )
    },
    {
      key: 'version',
      label: '版本',
      sortable: true,
      width: '6%',
      minWidth: '60px',
      render: (value: unknown, model: Model) => {
        const versionValue = modelVersions[model.id] || String(value);
        
        // 根据模型类型和基础模型生成版本选项
        const versionOptions = generateVersionOptions(model);
        
        const parsed = parseVersion(versionValue);
        const displayVersion = parsed ? parsed.sequenceNumber.toString() : versionValue;
        
        return (
          <div className={styles.versionCell}>
            <select
              className={styles.versionSelect}
              value={versionValue}
              onChange={(e) => handleVersionChange(model.id, e.target.value)}
              title={versionValue} /* 添加tooltip显示完整版本号 */
            >
              <option value={versionValue}>{displayVersion}</option>
              {versionOptions
                .filter((option) => option.value !== versionValue) // 过滤掉当前选中的版本
                .map((option) => {
                  const optionParsed = parseVersion(option.value);
                  let optionDisplay: string;
                  
                  if (optionParsed) {
                    // 只显示数字
                    optionDisplay = optionParsed.sequenceNumber.toString();
                  } else {
                    optionDisplay = option.value;
                  }
                  
                  return (
                    <option key={option.value} value={option.value}>
                      {optionDisplay}
                    </option>
                  );
                })}
            </select>
          </div>
        );
      }
    },
    {
      key: 'trainingCompletedAt',
      label: '训练完成时间',
      sortable: true,
      width: '20%',
      minWidth: '200px',
      render: (_: unknown, model: Model) => {
        const versionValue = modelVersions[model.id] || model.version;
        const date = getTrainingCompletedAt(versionValue);
        
        return (
          <span className={styles.dateCell}>
            {formatDate(date)}
          </span>
        );
      }
    },
    {
      key: 'tags',
      label: '标签',
      width: '18%',
      minWidth: '160px',
      render: (value: unknown) => {
        const tags = Array.isArray(value) ? value : [];
        
        // 动态计算显示标签数量，优先显示更多标签
        const maxVisibleTags = Math.min(tags.length, 3);
        const visibleTags = tags.slice(0, maxVisibleTags);
        const remainingCount = tags.length - maxVisibleTags;
        
        return (
          <div className={styles.tagsCell}>
            {visibleTags.map((tag, index) => (
              <Tag
                key={index}
                label={String(tag)}
                color="secondary"
                className={styles.tag}
              />
            ))}
            {remainingCount > 0 && (
              <Tooltip
                content={
                  <div className={styles.allTagsTooltip}>
                    <div className={styles.tooltipTitle}>
                      所有标签 ({tags.length}个):
                    </div>
                    <div className={styles.tooltipTags}>
                      {tags.map((tag, index) => (
                        <Tag
                          key={index}
                          label={String(tag)}
                          color="secondary"
                          className={styles.tooltipTag}
                        />
                      ))}
                    </div>
                  </div>
                }
                position="top"
                delay={300}
              >
                <span className={styles.moreTagsIndicator}>
                  +{remainingCount}
                </span>
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: '操作',
      width: '15%',
      minWidth: '150px',
      render: (_, model) => (
        <div className={styles.actionsCell}>
          {/* 关联/取消关联按钮 */}
          {showAssociationActions && (
            <>
              {isModelAssociated(model.id) ? (
                <button
                  className={`${styles.actionButton} ${styles.disassociateButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDisassociate?.(model.id);
                  }}
                  title="取消关联"
                >
                  取消关联
                </button>
              ) : (
                <button
                  className={`${styles.actionButton} ${styles.associateButton}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssociate?.(model.id);
                  }}
                  title="关联模型"
                >
                  关联
                </button>
              )}
            </>
          )}

          <Tooltip
            content={<ModelPreview model={model} />}
            position="top"
            delay={300}
          >
            <button
              className={`${styles.actionButton} ${styles.detailButton}`}
              title="查看详情"
            >
              详情
            </button>
          </Tooltip>



          <button
            className={`${styles.actionButton} ${styles.deleteButton}`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`确定要删除模型 "${model.name}" 吗？此操作不可撤销。`)) {
                console.log('删除模型:', model.name);
              }
            }}
            title="删除模型"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
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
    render: column.render || ((value: unknown) => String(value)),
    onClick: column.sortable ? () => handleSort(column) : undefined
  }));

  const handleRowClick = (model: Model) => {
    if (onRowClick) {
      onRowClick(model);
    }
  };

  const handleFilter = (columnKey: string, value: string) => {
    console.log('Filter triggered for column:', columnKey, 'with value:', value);
    
    const newFilters = { ...activeFilters };
    
    if (value) {
      const filterValues = value.split(',');
      newFilters[columnKey] = filterValues;
    } else {
      delete newFilters[columnKey];
    }
    
    setActiveFilters(newFilters);
    
    // 应用所有筛选条件
    let filtered = models;
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter(model => {
          const modelValue = model[key as keyof Model];
          return values.includes(String(modelValue));
        });
      }
    });
    
    setFilteredModels(filtered);
    console.log('Filtered models:', filtered);
  };

  return (
    <div className={[styles.modelTable, className].filter(Boolean).join(' ')}>
      <Table<Model>
        data={filteredModels}
        columns={enhancedColumns}
        loading={loading}
        onRowClick={handleRowClick}
        onFilter={handleFilter}
        emptyMessage="暂无模型数据"
        className={styles.table}
      />
    </div>
  );
};
