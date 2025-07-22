/**
 * 验证工具函数
 */

import type { Model, ModelFormData } from '../types';

/**
 * 验证模型名称
 * @param name 模型名称
 * @returns 验证结果
 */
export function validateModelName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: '模型名称不能为空' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: '模型名称至少需要2个字符' };
  }
  
  if (name.length > 100) {
    return { isValid: false, error: '模型名称不能超过100个字符' };
  }
  
  // 检查特殊字符
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { isValid: false, error: '模型名称包含无效字符' };
  }
  
  return { isValid: true };
}

/**
 * 验证模型版本号
 * @param version 版本号
 * @returns 验证结果
 */
export function validateVersion(version: string): { isValid: boolean; error?: string } {
  if (!version || version.trim().length === 0) {
    return { isValid: false, error: '版本号不能为空' };
  }
  
  // 简单的版本号格式验证（支持 v1.0.0 或 1.0.0 格式）
  const versionPattern = /^v?\d+\.\d+\.\d+(\.\d+)?$/;
  if (!versionPattern.test(version)) {
    return { isValid: false, error: '版本号格式无效，请使用 v1.0.0 或 1.0.0 格式' };
  }
  
  return { isValid: true };
}

/**
 * 验证准确率
 * @param accuracy 准确率
 * @returns 验证结果
 */
export function validateAccuracy(accuracy: number): { isValid: boolean; error?: string } {
  if (isNaN(accuracy)) {
    return { isValid: false, error: '准确率必须是数字' };
  }
  
  if (accuracy < 0 || accuracy > 1) {
    return { isValid: false, error: '准确率必须在0-1之间' };
  }
  
  return { isValid: true };
}

/**
 * 验证文件大小
 * @param size 文件大小（字节）
 * @returns 验证结果
 */
export function validateFileSize(size: number): { isValid: boolean; error?: string } {
  if (isNaN(size) || size < 0) {
    return { isValid: false, error: '文件大小必须是非负数' };
  }
  
  // 限制最大文件大小为10GB
  const maxSize = 10 * 1024 * 1024 * 1024;
  if (size > maxSize) {
    return { isValid: false, error: '文件大小不能超过10GB' };
  }
  
  return { isValid: true };
}

/**
 * 验证标签
 * @param tags 标签数组
 * @returns 验证结果
 */
export function validateTags(tags: string[]): { isValid: boolean; error?: string } {
  if (tags.length > 10) {
    return { isValid: false, error: '标签数量不能超过10个' };
  }
  
  for (const tag of tags) {
    if (!tag || tag.trim().length === 0) {
      return { isValid: false, error: '标签不能为空' };
    }
    
    if (tag.length > 20) {
      return { isValid: false, error: '单个标签长度不能超过20个字符' };
    }
    
    // 检查特殊字符
    const invalidChars = /[<>:"/\\|?*,]/;
    if (invalidChars.test(tag)) {
      return { isValid: false, error: '标签包含无效字符' };
    }
  }
  
  // 检查重复标签
  const uniqueTags = new Set(tags);
  if (uniqueTags.size !== tags.length) {
    return { isValid: false, error: '标签不能重复' };
  }
  
  return { isValid: true };
}

/**
 * 验证模型表单数据
 * @param formData 表单数据
 * @returns 验证结果
 */
export function validateModelForm(formData: ModelFormData): { 
  isValid: boolean; 
  errors: Record<string, string> 
} {
  const errors: Record<string, string> = {};
  
  // 验证名称
  const nameValidation = validateModelName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  // 验证标签
  const tagsValidation = validateTags(formData.tags);
  if (!tagsValidation.isValid) {
    errors.tags = tagsValidation.error!;
  }
  
  // 验证元数据
  if (formData.metadata.accuracy !== undefined) {
    const accuracyValidation = validateAccuracy(formData.metadata.accuracy);
    if (!accuracyValidation.isValid) {
      errors.accuracy = accuracyValidation.error!;
    }
  }
  
  if (formData.metadata.size !== undefined) {
    const sizeValidation = validateFileSize(formData.metadata.size);
    if (!sizeValidation.isValid) {
      errors.size = sizeValidation.error!;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * 检查模型名称是否重复
 * @param name 模型名称
 * @param models 现有模型列表
 * @param excludeId 排除的模型ID（用于编辑时）
 * @returns 是否重复
 */
export function isModelNameDuplicate(
  name: string, 
  models: Model[], 
  excludeId?: string
): boolean {
  return models.some(model => 
    model.name.toLowerCase() === name.toLowerCase() && 
    model.id !== excludeId
  );
}
