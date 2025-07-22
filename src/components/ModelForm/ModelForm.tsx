/**
 * ModelForm组件 - 模型信息表单
 */

import React, { useState } from 'react';
import type { Model, ModelFormData } from '../../types';
import { Input, Select, Button, Tag } from '../UI';
import { validateModelForm } from '../../utils';
import styles from './ModelForm.module.css';

export interface ModelFormProps {
  model?: Model;
  onSubmit: (data: ModelFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export const ModelForm: React.FC<ModelFormProps> = ({
  model,
  onSubmit,
  onCancel,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<ModelFormData>({
    name: model?.name || '',
    type: model?.type || 'segmentation',
    status: model?.status || 'active',
    tags: model?.tags || [],
    metadata: {
      framework: model?.metadata.framework || '',
      description: model?.metadata.description || '',
      accuracy: model?.metadata.accuracy || 0,
      size: model?.metadata.size || 0,
      author: model?.metadata.author || '',
      license: model?.metadata.license || '',
      trainingDataset: model?.metadata.trainingDataset || '',
      parameters: model?.metadata.parameters || 0
    }
  });

  const [tags, setTags] = useState<string[]>(model?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };



  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = { ...formData, tags };

    // 验证表单数据
    const validation = validateModelForm(submitData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(submitData);
  };

  const typeOptions = [
    { value: 'segmentation', label: '分割模型' },
    { value: 'detection', label: '检测模型' }
  ];

  const statusOptions = [
    { value: 'active', label: '活跃' },
    { value: 'archived', label: '归档' },
    { value: 'deprecated', label: '废弃' }
  ];

  const frameworkOptions = [
    { value: 'PyTorch', label: 'PyTorch' },
    { value: 'TensorFlow', label: 'TensorFlow' },
    { value: 'Keras', label: 'Keras' },
    { value: 'TensorFlow Lite', label: 'TensorFlow Lite' },
    { value: 'ONNX', label: 'ONNX' },
    { value: 'OpenVINO', label: 'OpenVINO' }
  ];

  return (
    <div className={[styles.modelForm, className].filter(Boolean).join(' ')}>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>基本信息</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>模型名称 *</label>
            <Input
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
              placeholder="请输入模型名称"
              error={errors.name}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>模型类型 *</label>
              <Select
                value={formData.type}
                onChange={(value) => setFormData({...formData, type: value as any})}
                options={typeOptions}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>状态</label>
              <Select
                value={formData.status}
                onChange={(value) => setFormData({...formData, status: value as any})}
                options={statusOptions}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>标签管理</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>标签</label>
            <div className={styles.tagInput}>
              <Input
                value={tagInput}
                onChange={setTagInput}
                placeholder="输入标签后按回车添加"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="secondary"
                size="small"
                disabled={!tagInput.trim()}
              >
                添加
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className={styles.tagList}>
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    label={tag}
                    removable
                    onRemove={() => handleRemoveTag(tag)}
                    color="primary"
                  />
                ))}
              </div>
            )}
            {errors.tags && (
              <span className={styles.error}>{errors.tags}</span>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>技术信息</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>框架</label>
              <Select
                value={formData.metadata.framework || ''}
                onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, framework: value}})}
                options={frameworkOptions}
                placeholder="选择框架"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>准确率</label>
              <Input
                value={formData.metadata.accuracy?.toString() || ''}
                onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, accuracy: parseFloat(value) || 0}})}
                type="number"
                placeholder="0.000"
                error={errors.accuracy}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>文件大小 (字节)</label>
              <Input
                value={formData.metadata.size?.toString() || ''}
                onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, size: parseInt(value) || 0}})}
                type="number"
                placeholder="文件大小"
                error={errors.size}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>参数数量</label>
              <Input
                value={formData.metadata.parameters?.toString() || ''}
                onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, parameters: parseInt(value) || 0}})}
                type="number"
                placeholder="参数数量"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>描述</label>
            <textarea
              value={formData.metadata.description || ''}
              onChange={(e) => setFormData({...formData, metadata: {...formData.metadata, description: e.target.value}})}
              className={styles.textarea}
              placeholder="请输入模型描述..."
              rows={3}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>其他信息</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>作者</label>
              <Input
                value={formData.metadata.author || ''}
                onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, author: value}})}
                placeholder="作者姓名"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>许可证</label>
              <Input
                value={formData.metadata.license || ''}
                onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, license: value}})}
                placeholder="如：MIT, Apache 2.0"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>训练数据集</label>
            <Input
              value={formData.metadata.trainingDataset || ''}
              onChange={(value) => setFormData({...formData, metadata: {...formData.metadata, trainingDataset: value}})}
              placeholder="训练数据集名称"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            disabled={loading}
          >
            取消
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {model ? '更新模型' : '创建模型'}
          </Button>
        </div>
      </form>
    </div>
  );
};
