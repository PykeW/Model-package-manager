/**
 * ModelDetail组件 - 模型详情展示
 */

import React from 'react';
import type { Model } from '../../types';
import { Tag, Button } from '../UI';
import { 
  formatFileSize, 
  formatPercentage, 
  formatDate, 
  formatRelativeTime,
  formatNumber 
} from '../../utils';
import styles from './ModelDetail.module.css';

export interface ModelDetailProps {
  model: Model;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  className?: string;
}

export const ModelDetail: React.FC<ModelDetailProps> = ({
  model,
  onEdit,
  onDelete,
  onClose,
  className = ''
}) => {
  const getStatusConfig = (status: Model['status']) => {
    const configs = {
      active: { label: '活跃', color: 'success' as const, icon: '✅' },
      archived: { label: '归档', color: 'warning' as const, icon: '📦' },
      deprecated: { label: '废弃', color: 'danger' as const, icon: '🗑️' }
    };
    return configs[status];
  };

  const getTypeConfig = (type: Model['type']) => {
    const configs = {
      segmentation: { label: '分割模型', color: 'primary' as const, icon: '🎯' },
      detection: { label: '检测模型', color: 'secondary' as const, icon: '🔎' }
    };
    return configs[type];
  };

  const statusConfig = getStatusConfig(model.status);
  const typeConfig = getTypeConfig(model.type);

  return (
    <div className={[styles.modelDetail, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{model.name}</h2>
          <div className={styles.badges}>
            <Tag label={typeConfig.label} color={typeConfig.color} />
            <Tag label={statusConfig.label} color={statusConfig.color} />
          </div>
        </div>
        
        <div className={styles.actions}>
          {onEdit && (
            <Button onClick={onEdit} variant="primary" size="small">
              编辑
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} variant="danger" size="small">
              删除
            </Button>
          )}
          {onClose && (
            <Button onClick={onClose} variant="ghost" size="small">
              关闭
            </Button>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>📊</span>
            基本信息
          </h3>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>版本号</span>
              <span className={styles.infoValue}>{model.version}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>更新时间</span>
              <span className={styles.infoValue}>
                {formatDate(model.timestamp)}
                <span className={styles.relativeTime}>
                  ({formatRelativeTime(model.timestamp)})
                </span>
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>框架</span>
              <span className={styles.infoValue}>{model.metadata.framework}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>⚡</span>
            性能指标
          </h3>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>🎯</div>
              <div className={styles.metricContent}>
                <div className={styles.metricValue}>
                  {formatPercentage(model.metadata.accuracy)}
                </div>
                <div className={styles.metricLabel}>准确率</div>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>💾</div>
              <div className={styles.metricContent}>
                <div className={styles.metricValue}>
                  {formatFileSize(model.metadata.size)}
                </div>
                <div className={styles.metricLabel}>文件大小</div>
              </div>
            </div>
            
            {model.metadata.parameters && (
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>🔢</div>
                <div className={styles.metricContent}>
                  <div className={styles.metricValue}>
                    {formatNumber(model.metadata.parameters)}
                  </div>
                  <div className={styles.metricLabel}>参数数量</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {model.tags.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>🏷️</span>
              标签
            </h3>
            
            <div className={styles.tagList}>
              {model.tags.map((tag, index) => (
                <Tag key={index} label={tag} color="secondary" />
              ))}
            </div>
          </div>
        )}

        {model.metadata.description && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.sectionIcon}>📝</span>
              描述
            </h3>
            
            <p className={styles.description}>
              {model.metadata.description}
            </p>
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>ℹ️</span>
            详细信息
          </h3>
          
          <div className={styles.detailGrid}>
            {model.metadata.author && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>作者</span>
                <span className={styles.detailValue}>{model.metadata.author}</span>
              </div>
            )}
            
            {model.metadata.license && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>许可证</span>
                <span className={styles.detailValue}>{model.metadata.license}</span>
              </div>
            )}
            
            {model.metadata.trainingDataset && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>训练数据集</span>
                <span className={styles.detailValue}>{model.metadata.trainingDataset}</span>
              </div>
            )}
            
            {model.metadata.inputShape && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>输入形状</span>
                <span className={styles.detailValue}>
                  [{model.metadata.inputShape.join(', ')}]
                </span>
              </div>
            )}
            
            {model.metadata.outputShape && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>输出形状</span>
                <span className={styles.detailValue}>
                  [{model.metadata.outputShape.join(', ')}]
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
