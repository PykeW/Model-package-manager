/**
 * FileUploadModal - 文件上传弹窗组件
 * 支持压缩包上传，显示上传进度和状态
 */

import React, { useState, useRef } from 'react';
import { Modal, Button } from '../';
import styles from './FileUploadModal.module.css';

export interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => Promise<void>;
  title?: string;
  acceptedTypes?: string;
  maxSize?: number; // 最大文件大小，单位MB
  className?: string;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  title = "上传模型文件",
  acceptedTypes = ".zip,.rar,.7z,.tar.gz",
  maxSize = 100, // 默认100MB
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      return `文件大小不能超过 ${maxSize}MB`;
    }
    
    const validExtensions = acceptedTypes.split(',').map(ext => ext.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.some(ext => fileExtension === ext)) {
      return `仅支持以下格式: ${acceptedTypes}`;
    }
    
    return null;
  };

  const validateFiles = (files: FileList): string | null => {
    if (files.length === 0) {
      return '请选择文件';
    }
    
    for (let i = 0; i < files.length; i++) {
      const error = validateFile(files[i]);
      if (error) return error;
    }
    
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const error = validateFiles(files);
    if (error) {
      setError(error);
      return;
    }
    
    setError('');
    setSelectedFiles(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      await onUpload(selectedFiles);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // 上传完成后稍等片刻关闭弹窗
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles(null);
    setError('');
    setUploadProgress(0);
    setUploading(false);
    onClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="medium"
      className={[styles.uploadModal, className].filter(Boolean).join(' ')}
    >
      <div className={styles.uploadContent}>
        {/* 拖拽上传区域 */}
        <div
          className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''} ${error ? styles.error : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleInputChange}
            className={styles.fileInput}
          />
          
          <div className={styles.dropzoneContent}>
            <div className={styles.uploadIcon}>📦</div>
            <h3 className={styles.dropzoneTitle}>选择或拖拽文件到此处</h3>
            <p className={styles.dropzoneText}>
              支持格式: {acceptedTypes.replace(/\./g, '').toUpperCase()}
            </p>
            <p className={styles.dropzoneText}>
              最大文件大小: {maxSize}MB
            </p>
            <Button variant="primary" size="small">
              选择文件
            </Button>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorIcon}>❌</span>
            {error}
          </div>
        )}

        {/* 选中的文件列表 */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className={styles.fileList}>
            <h4 className={styles.fileListTitle}>待上传文件：</h4>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                </div>
                <div className={styles.fileIcon}>📁</div>
              </div>
            ))}
          </div>
        )}

        {/* 上传进度 */}
        {uploading && (
          <div className={styles.progressContainer}>
            <div className={styles.progressInfo}>
              <span>上传进度: {uploadProgress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className={styles.actions}>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={uploading}
          >
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!selectedFiles || uploading}
            loading={uploading}
          >
            {uploading ? `上传中 ${uploadProgress}%` : '开始上传'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 