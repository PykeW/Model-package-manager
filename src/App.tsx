/**
 * App组件 - 应用程序主入口
 */

import { useState } from 'react';
import { ModelManagerModal } from './components/ModelManagerModal';
import './styles/global.css';
import styles from './App.module.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true); // 直接打开弹窗

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <ModelManagerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
