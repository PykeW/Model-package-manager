/**
 * ModelTable组件 - 模型表格展示
 */

import React from 'react';
import type { Model, ModelSort, TableColumn, ModelAssociationType } from '../../types';
import { Table, Tag, Tooltip } from '../UI';
import { formatFileSize } from '../../utils';
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
  
  // 检查模型是否已关联
  const isModelAssociated = (modelId: string): boolean => {
    return associations.some(assoc => assoc.modelId === modelId && assoc.isEnabled);
  };
  // 定义表格列
  const columns: TableColumn<Model>[] = [
    {
      key: 'index',
      label: '序号',
      width: '5%',
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
      width: '18%',
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
      sortable: true,
      width: '11%',
      render: (value: unknown) => (
        <Tag
          label={String(value) === 'segmentation' ? '分割模型' : '检测模型'}
          color={String(value) === 'segmentation' ? 'primary' : 'secondary'}
        />
      )
    },

    {
      key: 'size',
      label: '大小',
      sortable: true,
      width: '9%',
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
      width: '13%',
      render: (value: unknown) => {
        const versionValue = String(value);
        return (
          <div className={styles.versionCell}>
            <select
              className={styles.versionSelect}
              value={versionValue}
              onChange={(e) => console.log('Version changed:', e.target.value)}
            >
              <option value={versionValue}>{versionValue}</option>
              {/* 这里可以添加其他版本选项 */}
            </select>
          </div>
        );
      }
    },
    {
      key: 'tags',
      label: '标签',
      width: '22%',
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
      width: '22%',
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
              onClick={(e) => {
                e.stopPropagation();
                console.log('查看详情:', model.name);
              }}
              title="查看详情"
            >
              详情
            </button>
          </Tooltip>

          <button
            className={`${styles.actionButton} ${styles.editButton}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log('编辑模型:', model.name);
            }}
            title="编辑模型"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

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
