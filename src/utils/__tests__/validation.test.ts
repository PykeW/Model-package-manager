/**
 * 验证工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  validateModelName,
  validateVersion,
  validateAccuracy,
  validateFileSize,
  validateTags,
  validateModelForm,
  isModelNameDuplicate
} from '../validation';
import type { Model, ModelFormData } from '../../types';

describe('validateModelName', () => {
  it('should validate model names correctly', () => {
    expect(validateModelName('Valid Model')).toEqual({ isValid: true });
    expect(validateModelName('')).toEqual({ 
      isValid: false, 
      error: '模型名称不能为空' 
    });
    expect(validateModelName('A')).toEqual({ 
      isValid: false, 
      error: '模型名称至少需要2个字符' 
    });
    expect(validateModelName('A'.repeat(101))).toEqual({ 
      isValid: false, 
      error: '模型名称不能超过100个字符' 
    });
    expect(validateModelName('Invalid<Name')).toEqual({ 
      isValid: false, 
      error: '模型名称包含无效字符' 
    });
  });
});

describe('validateVersion', () => {
  it('should validate version strings correctly', () => {
    expect(validateVersion('v1.0.0')).toEqual({ isValid: true });
    expect(validateVersion('1.0.0')).toEqual({ isValid: true });
    expect(validateVersion('v1.0.0.1')).toEqual({ isValid: true });
    expect(validateVersion('')).toEqual({ 
      isValid: false, 
      error: '版本号不能为空' 
    });
    expect(validateVersion('invalid')).toEqual({ 
      isValid: false, 
      error: '版本号格式无效，请使用 v1.0.0 或 1.0.0 格式' 
    });
  });
});

describe('validateAccuracy', () => {
  it('should validate accuracy values correctly', () => {
    expect(validateAccuracy(0.5)).toEqual({ isValid: true });
    expect(validateAccuracy(0)).toEqual({ isValid: true });
    expect(validateAccuracy(1)).toEqual({ isValid: true });
    expect(validateAccuracy(NaN)).toEqual({ 
      isValid: false, 
      error: '准确率必须是数字' 
    });
    expect(validateAccuracy(-0.1)).toEqual({ 
      isValid: false, 
      error: '准确率必须在0-1之间' 
    });
    expect(validateAccuracy(1.1)).toEqual({ 
      isValid: false, 
      error: '准确率必须在0-1之间' 
    });
  });
});

describe('validateFileSize', () => {
  it('should validate file sizes correctly', () => {
    expect(validateFileSize(1024)).toEqual({ isValid: true });
    expect(validateFileSize(0)).toEqual({ isValid: true });
    expect(validateFileSize(-1)).toEqual({ 
      isValid: false, 
      error: '文件大小必须是非负数' 
    });
    expect(validateFileSize(NaN)).toEqual({ 
      isValid: false, 
      error: '文件大小必须是非负数' 
    });
    expect(validateFileSize(11 * 1024 * 1024 * 1024)).toEqual({ 
      isValid: false, 
      error: '文件大小不能超过10GB' 
    });
  });
});

describe('validateTags', () => {
  it('should validate tags correctly', () => {
    expect(validateTags(['tag1', 'tag2'])).toEqual({ isValid: true });
    expect(validateTags([])).toEqual({ isValid: true });
    expect(validateTags(Array(11).fill('tag'))).toEqual({ 
      isValid: false, 
      error: '标签数量不能超过10个' 
    });
    expect(validateTags([''])).toEqual({ 
      isValid: false, 
      error: '标签不能为空' 
    });
    expect(validateTags(['A'.repeat(21)])).toEqual({ 
      isValid: false, 
      error: '单个标签长度不能超过20个字符' 
    });
    expect(validateTags(['tag<invalid'])).toEqual({ 
      isValid: false, 
      error: '标签包含无效字符' 
    });
    expect(validateTags(['tag1', 'tag1'])).toEqual({ 
      isValid: false, 
      error: '标签不能重复' 
    });
  });
});

describe('validateModelForm', () => {
  it('should validate complete form data', () => {
    const validFormData: ModelFormData = {
      name: 'Test Model',
      type: 'segmentation',
      status: 'active',
      tags: ['tag1', 'tag2'],
      metadata: {
        framework: 'PyTorch',
        accuracy: 0.9,
        size: 1024 * 1024
      }
    };

    expect(validateModelForm(validFormData)).toEqual({ 
      isValid: true, 
      errors: {} 
    });

    const invalidFormData: ModelFormData = {
      name: '',
      type: 'segmentation',
      status: 'active',
      tags: ['tag1', 'tag1'],
      metadata: {
        framework: 'PyTorch',
        accuracy: 1.5,
        size: -1
      }
    };

    const result = validateModelForm(invalidFormData);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.tags).toBeDefined();
    expect(result.errors.accuracy).toBeDefined();
    expect(result.errors.size).toBeDefined();
  });
});

describe('isModelNameDuplicate', () => {
  const models: Model[] = [
    {
      id: '1',
      name: 'Existing Model',
      type: 'segmentation',
      version: 'v1.0.0',
      timestamp: new Date(),
      tags: [],
      status: 'active',
      metadata: {
        size: 1024,
        accuracy: 0.9,
        framework: 'PyTorch'
      }
    }
  ];

  it('should detect duplicate names', () => {
    expect(isModelNameDuplicate('Existing Model', models)).toBe(true);
    expect(isModelNameDuplicate('existing model', models)).toBe(true);
    expect(isModelNameDuplicate('New Model', models)).toBe(false);
  });

  it('should exclude specific model ID', () => {
    expect(isModelNameDuplicate('Existing Model', models, '1')).toBe(false);
    expect(isModelNameDuplicate('Existing Model', models, '2')).toBe(true);
  });
});
