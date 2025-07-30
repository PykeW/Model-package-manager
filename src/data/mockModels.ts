/**
 * 模拟模型数据
 */

import type { Model } from '../types';

// 创建模拟数据
export const mockModels: Model[] = [
  {
    id: 'model-1',
    name: '手机屏幕正面检测',
    type: 'segmentation',
    version: 'bisegnet_1',
    timestamp: new Date('2024-12-15T09:30:00'),
    trainingCompletedAt: new Date('2024-12-15T08:45:00'),
    tags: [
      '上1', '整体大块', '核心区域', '屏幕划痕', '玻璃破损', 
      '气泡', '污点', '变形', '裂纹', '破损',
      '色差', '异物', '凹陷', '凸起', '毛刺',
      '锈蚀', '腐蚀', '磨损', '断裂', '松动',
      '偏移', '错位', '缺失', '多余', '尺寸异常',
      '形状异常', '纹理异常', '光泽异常', '透明度异常', '厚度异常'
    ],
    status: 'active',
    metadata: {
      size: 52428800, // 50MB
      accuracy: 0.892,
      framework: 'PyTorch',
      description: '基于YOLOv8的手机屏幕正面缺陷检测模型，支持30种缺陷类型检测',
      author: 'AI团队',
      license: 'MIT',
      trainingDataset: 'COCO 2017',
      inputShape: [3, 640, 640],
      outputShape: [8400, 84],
      parameters: 11173632
    }
  },
  {
    id: 'model-2',
    name: '手机屏幕背面检测',
    type: 'segmentation',
    version: 'sam_2',
    timestamp: new Date('2024-12-10T16:45:00'),
    trainingCompletedAt: new Date('2024-12-10T15:30:00'),
    tags: ['上2', '下1', '边缘区域', '摄像头区域', '指纹识别'],
    status: 'active',
    metadata: {
      size: 104857600, // 100MB
      accuracy: 0.945,
      framework: 'TensorFlow',
      description: '手机屏幕背面缺陷检测模型，专为摄像头和指纹识别区域设计',
      author: '医疗AI实验室',
      license: 'Apache 2.0',
      trainingDataset: 'Medical Segmentation Dataset',
      inputShape: [1, 512, 512, 3],
      outputShape: [1, 512, 512, 21],
      parameters: 59342976
    }
  },
  {
    id: 'model-3',
    name: '手机边框检测',
    type: 'detection',
    version: 'YOLOv8_1',
    timestamp: new Date('2024-12-08T11:20:00'),
    trainingCompletedAt: new Date('2024-12-08T10:15:00'),
    tags: ['上3', '下2', '关键节点', '金属边框', '塑料边框'],
    status: 'active',
    metadata: {
      size: 78643200, // 75MB
      accuracy: 0.876,
      framework: 'PyTorch',
      description: '手机边框缺陷检测模型，适用于金属和塑料边框质检',
      author: '工业AI团队',
      license: 'BSD-3-Clause',
      trainingDataset: 'Industrial Defect Dataset',
      inputShape: [3, 800, 800],
      outputShape: [1000, 5],
      parameters: 41943040
    }
  },
  {
    id: 'model-4',
    name: '手机摄像头检测',
    type: 'detection',
    version: 'YOLOv8_2',
    timestamp: new Date('2024-12-05T14:15:00'),
    trainingCompletedAt: new Date('2024-12-05T13:00:00'),
    tags: ['上4', '下3', '辅助区域', '前置摄像头', '后置摄像头'],
    status: 'archived',
    metadata: {
      size: 26214400, // 25MB
      accuracy: 0.734,
      framework: 'TensorFlow Lite',
      description: '手机摄像头缺陷检测模型，支持前置和后置摄像头检测',
      author: 'Mobile AI团队',
      license: 'MIT',
      trainingDataset: 'PASCAL VOC',
      inputShape: [1, 300, 300, 3],
      outputShape: [1, 1917, 4],
      parameters: 6802816
    }
  },
  {
    id: 'model-5',
    name: '手机电池检测',
    type: 'segmentation',
    version: 'deeplab_3',
    timestamp: new Date('2024-12-01T10:30:00'),
    trainingCompletedAt: new Date('2024-12-01T09:15:00'),
    tags: ['下4', '整体大块', '主要区域', '电池膨胀', '电池漏液'],
    status: 'deprecated',
    metadata: {
      size: 67108864, // 64MB
      accuracy: 0.912,
      framework: 'Keras',
      description: '手机电池缺陷检测模型，专用于电池膨胀和漏液检测',
      author: '生物医学AI实验室',
      license: 'GPL-3.0',
      trainingDataset: 'Medical Image Segmentation Challenge',
      inputShape: [1, 256, 256, 1],
      outputShape: [1, 256, 256, 1],
      parameters: 31030337
    }
  },
  {
    id: 'model-6',
    name: '手机按键检测',
    type: 'detection',
    version: 'YOLOv8_3',
    timestamp: new Date('2024-11-28T13:45:00'),
    trainingCompletedAt: new Date('2024-11-28T12:30:00'),
    tags: ['上1', '上2', '连接区域', '音量键', '电源键'],
    status: 'active',
    metadata: {
      size: 83886080, // 80MB
      accuracy: 0.901,
      framework: 'PyTorch',
      description: '手机按键缺陷检测模型，支持音量键和电源键检测',
      author: 'Vision AI团队',
      license: 'Apache 2.0',
      trainingDataset: 'COCO 2017',
      inputShape: [3, 1024, 1024],
      outputShape: [49104, 90],
      parameters: 20723616
    }
  },
  {
    id: 'model-7',
    name: '手机扬声器检测',
    type: 'segmentation',
    version: 'maskrcnn_4',
    timestamp: new Date('2024-11-25T08:20:00'),
    trainingCompletedAt: new Date('2024-11-25T07:05:00'),
    tags: ['下1', '下2', '过渡区域', '听筒', '扬声器'],
    status: 'active',
    metadata: {
      size: 157286400, // 150MB
      accuracy: 0.923,
      framework: 'PyTorch',
      description: '手机扬声器缺陷检测模型，支持听筒和扬声器检测',
      author: 'Computer Vision Lab',
      license: 'MIT',
      trainingDataset: 'COCO 2017',
      inputShape: [3, 1024, 1024],
      outputShape: [100, 81],
      parameters: 44177280
    }
  },
  {
    id: 'model-8',
    name: '手机充电口检测',
    type: 'detection',
    version: 'YOLOv8_4',
    timestamp: new Date('2024-11-20T15:10:00'),
    trainingCompletedAt: new Date('2024-11-20T13:55:00'),
    tags: ['上3', '上4', '特殊区域', 'USB-C', 'Lightning'],
    status: 'active',
    metadata: {
      size: 94371840, // 90MB
      accuracy: 0.887,
      framework: 'PyTorch',
      description: '手机充电口缺陷检测模型，支持USB-C和Lightning接口检测',
      author: 'NAS Research Team',
      license: 'Apache 2.0',
      trainingDataset: 'COCO 2017 + Custom Dataset',
      inputShape: [3, 640, 640],
      outputShape: [8400, 84],
      parameters: 47020736
    }
  },
  {
    id: 'model-9',
    name: '平板屏幕正面检测',
    type: 'segmentation',
    version: 'unet_5',
    timestamp: new Date('2024-11-15T12:30:00'),
    trainingCompletedAt: new Date('2024-11-15T11:15:00'),
    tags: ['平板', '屏幕', '正面', '触控', '显示'],
    status: 'active',
    metadata: {
      size: 62914560, // 60MB
      accuracy: 0.915,
      framework: 'PyTorch',
      description: '平板电脑屏幕正面缺陷检测模型，支持触控和显示区域检测',
      author: '平板AI团队',
      license: 'MIT',
      trainingDataset: 'Tablet Screen Dataset',
      inputShape: [3, 768, 768],
      outputShape: [10000, 90],
      parameters: 25165824
    }
  },
  {
    id: 'model-10',
    name: '笔记本电脑键盘检测',
    type: 'detection',
    version: 'YOLOv11_1',
    timestamp: new Date('2024-11-10T09:45:00'),
    trainingCompletedAt: new Date('2024-11-10T08:30:00'),
    tags: ['笔记本', '键盘', '按键', '背光'],
    status: 'active',
    metadata: {
      size: 41943040, // 40MB
      accuracy: 0.856,
      framework: 'TensorFlow',
      description: '笔记本电脑键盘缺陷检测模型，支持按键和背光检测',
      author: '笔记本AI团队',
      license: 'Apache 2.0',
      trainingDataset: 'Laptop Keyboard Dataset',
      inputShape: [3, 512, 512],
      outputShape: [2500, 5],
      parameters: 16777216
    }
  },
  {
    id: 'model-11',
    name: '智能手表表盘检测',
    type: 'segmentation',
    version: 'fasterrcnn_6',
    timestamp: new Date('2024-11-05T14:20:00'),
    trainingCompletedAt: new Date('2024-11-05T13:05:00'),
    tags: ['智能手表', '表盘', '显示屏', '触控'],
    status: 'active',
    metadata: {
      size: 20971520, // 20MB
      accuracy: 0.878,
      framework: 'TensorFlow Lite',
      description: '智能手表表盘缺陷检测模型，支持显示屏和触控区域检测',
      author: '穿戴AI团队',
      license: 'MIT',
      trainingDataset: 'Smartwatch Dataset',
      inputShape: [3, 256, 256],
      outputShape: [1000, 20],
      parameters: 8388608
    }
  },
  {
    id: 'model-12',
    name: '耳机外观检测',
    type: 'detection',
    version: 'YOLOv8_5',
    timestamp: new Date('2024-10-30T11:15:00'),
    trainingCompletedAt: new Date('2024-10-30T09:45:00'),
    tags: ['耳机', '外观', '线材', '接口'],
    status: 'active',
    metadata: {
      size: 31457280, // 30MB
      accuracy: 0.834,
      framework: 'PyTorch',
      description: '耳机外观缺陷检测模型，支持线材和接口检测',
      author: '音频AI团队',
      license: 'BSD-3-Clause',
      trainingDataset: 'Headphone Dataset',
      inputShape: [3, 400, 400],
      outputShape: [1500, 5],
      parameters: 12582912
    }
  }
];

// 导出模型统计信息
export const modelStats = {
  total: mockModels.length,
  active: mockModels.filter(m => m.status === 'active').length,
  archived: mockModels.filter(m => m.status === 'archived').length,
  deprecated: mockModels.filter(m => m.status === 'deprecated').length,
  segmentation: mockModels.filter(m => m.type === 'segmentation').length,
  detection: mockModels.filter(m => m.type === 'detection').length
};

// 按产品类型分组的模型统计
export const productModelStats = {
  phone: mockModels.filter(m => m.name.includes('手机')).length,
  tablet: mockModels.filter(m => m.name.includes('平板')).length,
  laptop: mockModels.filter(m => m.name.includes('笔记本')).length,
  watch: mockModels.filter(m => m.name.includes('手表')).length,
  headphone: mockModels.filter(m => m.name.includes('耳机')).length
};
