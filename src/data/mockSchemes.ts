/**
 * 模拟方案和模型关联数据
 */

import type { SchemeType, ModelAssociationType } from '../types';

/**
 * 模拟运行方案数据
 */
export const mockSchemes: SchemeType[] = [
  {
    id: 'scheme-1',
    name: '电子元件质检方案A',
    description: '针对PCB板电子元件的全面质量检测方案，包含元件缺失、错位、极性错误等检测',
    associatedModels: [], // 将通过关联数据动态填充
    isActive: true,
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    category: '电子制造',
    priority: 9
  },
  {
    id: 'scheme-2',
    name: '医疗影像分析方案',
    description: '用于医疗设备的影像分析和病变检测，支持多种医疗影像格式',
    associatedModels: [],
    isActive: false,
    createdAt: '2024-01-05T10:15:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    category: '医疗影像',
    priority: 8
  },
  {
    id: 'scheme-3',
    name: '通用缺陷检测方案',
    description: '适用于多种工业产品的表面缺陷检测，包括划痕、凹陷、污渍等',
    associatedModels: [],
    isActive: false,
    createdAt: '2023-12-20T09:00:00Z',
    updatedAt: '2024-01-08T11:30:00Z',
    category: '工业检测',
    priority: 7
  }
];

/**
 * 模拟模型关联配置数据
 * 这里模拟电子元件质检方案A关联了几个模型
 */
export const mockModelAssociations: ModelAssociationType[] = [
  {
    modelId: 'model-1', // 对应YOLOv8-Segmentation
    schemeId: 'scheme-1',
    priority: 9,
    associatedAt: '2024-01-15T14:20:00Z',
    isEnabled: true,
    config: {
      weight: 0.8,
      threshold: 0.75,
      notes: '主要用于元件轮廓分割，高优先级模型'
    }
  },
  {
    modelId: 'model-3', // 对应RCNN-Detection-v2
    schemeId: 'scheme-1',
    priority: 8,
    associatedAt: '2024-01-15T14:25:00Z',
    isEnabled: true,
    config: {
      weight: 0.7,
      threshold: 0.8,
      notes: '用于缺陷检测，配合分割模型使用'
    }
  },
  {
    modelId: 'model-6', // 对应EfficientDet-D4
    schemeId: 'scheme-1',
    priority: 6,
    associatedAt: '2024-01-15T14:30:00Z',
    isEnabled: false,
    config: {
      weight: 0.6,
      threshold: 0.7,
      notes: '备用检测模型，当前已禁用'
    }
  }
];

/**
 * 获取当前活跃方案
 */
export const getCurrentActiveScheme = (): SchemeType | null => {
  return mockSchemes.find(scheme => scheme.isActive) || null;
};

/**
 * 根据方案ID获取关联的模型配置
 */
export const getAssociationsBySchemeId = (schemeId: string): ModelAssociationType[] => {
  return mockModelAssociations.filter(association => association.schemeId === schemeId);
};

/**
 * 根据方案ID获取关联的模型ID列表
 */
export const getAssociatedModelIds = (schemeId: string): string[] => {
  return mockModelAssociations
    .filter(association => association.schemeId === schemeId && association.isEnabled)
    .sort((a, b) => b.priority - a.priority) // 按优先级降序排列
    .map(association => association.modelId);
};

/**
 * 更新方案的关联模型列表（用于同步数据）
 */
export const updateSchemeAssociatedModels = (): void => {
  mockSchemes.forEach(scheme => {
    scheme.associatedModels = getAssociatedModelIds(scheme.id);
  });
};

// 初始化时更新关联数据
updateSchemeAssociatedModels(); 