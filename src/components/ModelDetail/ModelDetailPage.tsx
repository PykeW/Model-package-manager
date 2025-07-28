import React from 'react';
import type { Model } from '../../types';
import { Button, Tag } from '../UI';
import styles from './ModelDetailPage.module.css';

interface ModelDetailPageProps {
  model: Model;
  onBack: () => void;
  onEdit: () => void;
}

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({
  model,
  onBack,
  onEdit
}) => {
  // 生成详细的标签统计
  const getDetailedTagStats = () => {
    return model.tags.map((tag) => ({
      tag,
      count: Math.floor(Math.random() * 100) + 20,
      accuracy: (Math.random() * 0.2 + 0.8).toFixed(3), // 0.8-1.0
      avgSize: Math.floor(Math.random() * 500) + 100 // 100-600 pixels
    }));
  };

  const tagStats = getDetailedTagStats();

  return (
    <div className={styles.modelDetailPage}>
      {/* 页面头部 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Button variant="ghost" onClick={onBack} className={styles.backButton}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            返回
          </Button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{model.name}</h1>
            <p className={styles.subtitle}>
              {model.type === 'segmentation' ? '分割模型' : '检测模型'} · {model.version}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="primary" onClick={onEdit}>
            编辑模型
          </Button>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className={styles.content}>
        {/* 左侧：基本信息和规格 */}
        <div className={styles.leftColumn}>
          {/* 模型预览 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>模型预览</h2>
            <div className={styles.previewContainer}>
              <div className={styles.modelPreview}>
                <svg viewBox="0 0 300 200" className={styles.previewImage}>
                  <rect width="300" height="200" fill="var(--tertiary-bg)" />
                  <g fill="var(--text-tertiary)">
                    <circle cx="100" cy="80" r="12" />
                    <path d="M60 120 L120 90 L180 110 L240 80 L240 180 L60 180 Z" />
                  </g>
                  <text x="150" y="190" textAnchor="middle" fontSize="14" fill="var(--text-tertiary)">
                    {model.name} 预览图
                  </text>
                </svg>
              </div>
            </div>
          </section>

          {/* 基本信息 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>基本信息</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>模型名称</span>
                <span className={styles.infoValue}>{model.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>模型类型</span>
                <span className={styles.infoValue}>
                  {model.type === 'segmentation' ? '分割模型' : '检测模型'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>版本号</span>
                <span className={styles.infoValue}>{model.version}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>文件大小</span>
                <span className={styles.infoValue}>
                  {(model.metadata.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>框架</span>
                <span className={styles.infoValue}>{model.metadata.framework}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>作者</span>
                <span className={styles.infoValue}>{model.metadata.author}</span>
              </div>
            </div>
          </section>

          {/* 使用规格 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>使用规格</h2>
            <div className={styles.specGrid}>
              <div className={styles.specCard}>
                <h3 className={styles.specTitle}>推荐输入尺寸</h3>
                <div className={styles.specValue}>
                  {model.type === 'segmentation' ? '512×512' : '640×640'} 像素
                </div>
                <p className={styles.specNote}>
                  最佳性能尺寸，支持其他尺寸但可能影响精度
                </p>
              </div>
              <div className={styles.specCard}>
                <h3 className={styles.specTitle}>支持格式</h3>
                <div className={styles.specValue}>JPG, PNG, BMP</div>
                <p className={styles.specNote}>
                  推荐使用JPG格式以获得最佳处理速度
                </p>
              </div>
              <div className={styles.specCard}>
                <h3 className={styles.specTitle}>颜色空间</h3>
                <div className={styles.specValue}>RGB</div>
                <p className={styles.specNote}>
                  自动转换其他颜色空间到RGB
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* 右侧：统计和性能 */}
        <div className={styles.rightColumn}>
          {/* 标签统计 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>标签统计</h2>
            <div className={styles.tagStatsContainer}>
              {tagStats.map((stat, index) => (
                <div key={index} className={styles.tagStatCard}>
                  <div className={styles.tagStatHeader}>
                    <Tag label={stat.tag} color="secondary" />
                    <span className={styles.tagCount}>{stat.count}个轮廓</span>
                  </div>
                  <div className={styles.tagStatDetails}>
                    <div className={styles.tagStatItem}>
                      <span className={styles.tagStatLabel}>平均精度:</span>
                      <span className={styles.tagStatValue}>{stat.accuracy}</span>
                    </div>
                    <div className={styles.tagStatItem}>
                      <span className={styles.tagStatLabel}>平均尺寸:</span>
                      <span className={styles.tagStatValue}>{stat.avgSize}px</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 性能指标 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>性能指标</h2>
            <div className={styles.performanceGrid}>
              <div className={styles.perfCard}>
                <div className={styles.perfValue}>
                  {(model.metadata.accuracy * 100).toFixed(1)}%
                </div>
                <div className={styles.perfLabel}>整体准确率</div>
              </div>
              <div className={styles.perfCard}>
                <div className={styles.perfValue}>
                  {model.type === 'segmentation' ? '~50ms' : '~30ms'}
                </div>
                <div className={styles.perfLabel}>平均处理时间</div>
              </div>
              <div className={styles.perfCard}>
                <div className={styles.perfValue}>
                  {((model.metadata.parameters || 0) / 1000000).toFixed(1)}M
                </div>
                <div className={styles.perfLabel}>参数数量</div>
              </div>
              <div className={styles.perfCard}>
                <div className={styles.perfValue}>
                  {model.type === 'segmentation' ? '95.2%' : '92.8%'}
                </div>
                <div className={styles.perfLabel}>召回率</div>
              </div>
            </div>
          </section>

          {/* 技术参数 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>技术参数</h2>
            <div className={styles.techParams}>
              <div className={styles.paramItem}>
                <span className={styles.paramLabel}>训练数据集:</span>
                <span className={styles.paramValue}>{model.metadata.trainingDataset}</span>
              </div>
              <div className={styles.paramItem}>
                <span className={styles.paramLabel}>许可证:</span>
                <span className={styles.paramValue}>{model.metadata.license}</span>
              </div>
              <div className={styles.paramItem}>
                <span className={styles.paramLabel}>输入形状:</span>
                <span className={styles.paramValue}>
                  [{model.metadata.inputShape?.join(', ')}]
                </span>
              </div>
              <div className={styles.paramItem}>
                <span className={styles.paramLabel}>输出形状:</span>
                <span className={styles.paramValue}>
                  [{model.metadata.outputShape?.join(', ')}]
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
