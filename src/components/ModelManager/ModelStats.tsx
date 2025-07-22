/**
 * ModelStats组件 - 模型统计信息
 */

import React from 'react';
import type { Model } from '../../types';
import styles from './ModelStats.module.css';

export interface ModelStatsProps {
  models: Model[];
  filteredModels: Model[];
  className?: string;
}

export const ModelStats: React.FC<ModelStatsProps> = ({
  models,
  filteredModels,
  className = ''
}) => {
  // 计算统计信息
  const stats = {
    total: models.length,
    filtered: filteredModels.length,
    active: models.filter(m => m.status === 'active').length,
    archived: models.filter(m => m.status === 'archived').length,
    deprecated: models.filter(m => m.status === 'deprecated').length,
    segmentation: models.filter(m => m.type === 'segmentation').length,
    detection: models.filter(m => m.type === 'detection').length
  };

  const statItems = [
    {
      label: '总计',
      value: stats.total,
      color: 'primary',
      icon: '📊'
    },
    {
      label: '当前显示',
      value: stats.filtered,
      color: 'info',
      icon: '🔍'
    },
    {
      label: '活跃',
      value: stats.active,
      color: 'success',
      icon: '✅'
    },
    {
      label: '归档',
      value: stats.archived,
      color: 'warning',
      icon: '📦'
    },
    {
      label: '废弃',
      value: stats.deprecated,
      color: 'danger',
      icon: '🗑️'
    },
    {
      label: '分割模型',
      value: stats.segmentation,
      color: 'primary',
      icon: '🎯'
    },
    {
      label: '检测模型',
      value: stats.detection,
      color: 'secondary',
      icon: '🔎'
    }
  ];

  return (
    <div className={[styles.statsContainer, className].filter(Boolean).join(' ')}>
      <h3 className={styles.statsTitle}>模型统计</h3>
      <div className={styles.statsGrid}>
        {statItems.map((item, index) => (
          <div
            key={index}
            className={[styles.statItem, styles[item.color]].join(' ')}
          >
            <div className={styles.statIcon}>{item.icon}</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{item.value}</div>
              <div className={styles.statLabel}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
