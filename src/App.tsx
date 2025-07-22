/**
 * App组件 - 应用程序主入口
 */

import { useState } from 'react';
import { ModelManagerModal } from './components/ModelManagerModal';
import { Button } from './components/UI';
import './styles/global.css';
import styles from './App.module.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>模型管理系统</h1>
          <p className={styles.subtitle}>
            工业级AI模型管理解决方案
          </p>
        </header>

        <main className={styles.main}>
          <div className={styles.hero}>
            <div className={styles.heroIcon}>🤖</div>
            <h2 className={styles.heroTitle}>AI模型管理器</h2>
            <p className={styles.heroDescription}>
              统一管理和展示您的AI分割模型和检测模型，支持版本控制、性能监控和元数据管理。
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <h3 className={styles.featureTitle}>表格化展示</h3>
                <p className={styles.featureDescription}>
                  直观的表格界面，支持排序、筛选和搜索功能
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🏷️</div>
                <h3 className={styles.featureTitle}>标签管理</h3>
                <p className={styles.featureDescription}>
                  灵活的标签系统，便于模型分类和快速检索
                </p>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>⏰</div>
                <h3 className={styles.featureTitle}>版本控制</h3>
                <p className={styles.featureDescription}>
                  基于时间戳的版本管理，追踪模型演进历史
                </p>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                onClick={handleOpenModal}
                variant="primary"
                size="large"
                className={styles.primaryButton}
              >
                打开模型管理器
              </Button>

              <Button
                variant="secondary"
                size="large"
                className={styles.secondaryButton}
              >
                查看文档
              </Button>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2024 模型管理系统 - 基于React 18和TypeScript构建
          </p>
        </footer>
      </div>

      <ModelManagerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
