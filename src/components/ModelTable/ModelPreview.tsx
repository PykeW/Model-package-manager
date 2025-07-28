import React from 'react';
import type { Model } from '../../types';
import styles from './ModelPreview.module.css';

interface ModelPreviewProps {
  model: Model;
}

export const ModelPreview: React.FC<ModelPreviewProps> = ({ model }) => {
  // 生成标签统计数据
  const getTagStats = () => {
    const stats = model.tags.map((tag) => ({
      tag,
      count: Math.floor(Math.random() * 50) + 10 // 模拟轮廓数量 10-59
    }));
    return stats;
  };

  const tagStats = getTagStats();

  return (
    <div className={styles.modelPreview}>
      {/* 预览图片 */}
      <div className={styles.previewImage}>
        <div className={styles.placeholder}>
          <svg viewBox="0 0 200 150" className={styles.placeholderIcon}>
            <rect width="200" height="150" fill="var(--tertiary-bg)" />
            <g fill="var(--text-tertiary)">
              <circle cx="70" cy="60" r="8" />
              <path d="M50 90 L90 70 L130 85 L170 65 L170 130 L50 130 Z" />
            </g>
            <text x="100" y="140" textAnchor="middle" fontSize="12" fill="var(--text-tertiary)">
              模型预览
            </text>
          </svg>
        </div>
      </div>

      {/* 基本信息 */}
      <div className={styles.basicInfo}>
        <h4 className={styles.modelName}>{model.name}</h4>
        <div className={styles.infoRow}>
          <span className={styles.label}>类型:</span>
          <span className={styles.value}>
            {model.type === 'segmentation' ? '分割模型' : '检测模型'}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>版本:</span>
          <span className={styles.value}>{model.version}</span>
        </div>
      </div>

      {/* 推荐规格 */}
      <div className={styles.specifications}>
        <h5 className={styles.sectionTitle}>推荐规格</h5>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>输入尺寸:</span>
          <span className={styles.specValue}>
            {model.type === 'segmentation' ? '512×512' : '640×640'}
          </span>
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>图片格式:</span>
          <span className={styles.specValue}>JPG, PNG</span>
        </div>
      </div>

      {/* 标签统计 */}
      <div className={styles.tagStats}>
        <h5 className={styles.sectionTitle}>标签统计</h5>
        <div className={styles.statsGrid}>
          {tagStats.map((stat, index) => (
            <div key={index} className={styles.statItem}>
              <span className={styles.statTag}>{stat.tag}:</span>
              <span className={styles.statCount}>{stat.count}个</span>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};
