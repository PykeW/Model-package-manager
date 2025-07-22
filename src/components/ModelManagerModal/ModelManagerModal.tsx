/**
 * ModelManagerModal组件 - 模型管理器弹窗
 */

import React, { useState } from 'react';
import type { Model, ModelFormData } from '../../types';
import { Modal } from '../UI';
import { ModelManager } from '../ModelManager';
import { ModelForm, ModelDetail } from '../ModelForm';
import { mockModels } from '../../data/mockModels';
import { generateId, generateVersion } from '../../utils';
import styles from './ModelManagerModal.module.css';

export interface ModelManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModels?: Model[];
  className?: string;
}

type ModalView = 'manager' | 'form' | 'detail';

export const ModelManagerModal: React.FC<ModelManagerModalProps> = ({
  isOpen,
  onClose,
  initialModels = mockModels,
  className = ''
}) => {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [currentView, setCurrentView] = useState<ModalView>('manager');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setCurrentView('manager');
    setSelectedModel(null);
    setEditingModel(null);
    onClose();
  };

  // const handleModelClick = (model: Model) => {
  //   setSelectedModel(model);
  //   setCurrentView('detail');
  // };

  const handleAddModel = () => {
    setEditingModel(null);
    setCurrentView('form');
  };

  const handleEditModel = (model?: Model) => {
    setEditingModel(model || selectedModel);
    setCurrentView('form');
  };

  const handleDeleteModel = (model?: Model) => {
    const modelToDelete = model || selectedModel;
    if (modelToDelete && window.confirm(`确定要删除模型 "${modelToDelete.name}" 吗？`)) {
      setModels(prev => prev.filter(m => m.id !== modelToDelete.id));
      setSelectedModel(null);
      setCurrentView('manager');
    }
  };

  const handleFormSubmit = async (formData: ModelFormData) => {
    setLoading(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingModel) {
        // 更新现有模型
        const updatedModel: Model = {
          ...editingModel,
          ...formData,
          timestamp: new Date(),
          version: generateVersion(),
          metadata: {
            ...editingModel.metadata,
            ...formData.metadata,
            size: formData.metadata.size || 0,
            accuracy: formData.metadata.accuracy || 0,
            framework: formData.metadata.framework || ''
          }
        };
        
        setModels(prev => prev.map(m => 
          m.id === editingModel.id ? updatedModel : m
        ));
      } else {
        // 创建新模型
        const newModel: Model = {
          id: generateId(),
          ...formData,
          timestamp: new Date(),
          version: generateVersion(),
          metadata: {
            ...formData.metadata,
            size: formData.metadata.size || 0,
            accuracy: formData.metadata.accuracy || 0,
            framework: formData.metadata.framework || ''
          }
        };
        
        setModels(prev => [newModel, ...prev]);
      }
      
      setCurrentView('manager');
      setEditingModel(null);
    } catch (error) {
      console.error('保存模型失败:', error);
      alert('保存模型失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleFormCancel = () => {
    setCurrentView(selectedModel ? 'detail' : 'manager');
    setEditingModel(null);
  };

  const handleDetailClose = () => {
    setSelectedModel(null);
    setCurrentView('manager');
  };

  const getModalTitle = () => {
    switch (currentView) {
      case 'form':
        return editingModel ? '编辑模型' : '添加模型';
      case 'detail':
        return selectedModel?.name || '模型详情';
      default:
        return '模型管理器';
    }
  };

  const getModalSize = () => {
    switch (currentView) {
      case 'manager':
        return 'fullscreen' as const;
      case 'form':
      case 'detail':
        return 'large' as const;
      default:
        return 'medium' as const;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return (
          <ModelForm
            model={editingModel || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            loading={loading}
            className={styles.formContent}
          />
        );
        
      case 'detail':
        return selectedModel ? (
          <ModelDetail
            model={selectedModel}
            onEdit={() => handleEditModel(selectedModel)}
            onDelete={() => handleDeleteModel(selectedModel)}
            onClose={handleDetailClose}
            className={styles.detailContent}
          />
        ) : null;
        
      default:
        return (
          <div className={styles.managerContent}>
            <ModelManager
              models={models}
              className={styles.manager}
            />
            <div className={styles.managerActions}>
              <button
                onClick={handleAddModel}
                className={styles.addButton}
              >
                <span className={styles.addIcon}>+</span>
                添加模型
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={getModalTitle()}
      size={getModalSize()}
      className={[styles.modelManagerModal, className].filter(Boolean).join(' ')}
    >
      <div className={styles.modalContent}>
        {renderContent()}
      </div>
    </Modal>
  );
};
