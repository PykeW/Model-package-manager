/**
 * 模拟模型数据
 */

import type { Model } from '../types';

// 创建模拟数据
export const mockModels: Model[] = [
  {
    id: 'model-1',
    name: 'YOLOv8-Segmentation',
    type: 'segmentation',
    version: 'v2024.01.15.1430',
    timestamp: new Date('2024-12-15T09:30:00'),
    tags: [
      '上1', '整体大块', '核心区域', '边缘缺陷', '表面划痕', 
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
      description: '基于YOLOv8的实例分割模型，适用于实时场景，支持30种缺陷类型检测',
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
    name: 'DeepLab-v3-Plus',
    type: 'segmentation',
    version: 'v2024.01.10.0900',
    timestamp: new Date('2024-12-10T16:45:00'),
    tags: ['上2', '下1', '边缘区域'],
    status: 'active',
    metadata: {
      size: 104857600, // 100MB
      accuracy: 0.945,
      framework: 'TensorFlow',
      description: '深度学习语义分割模型，专为医疗影像设计',
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
    name: 'RCNN-Detection-v2',
    type: 'detection',
    version: 'v2023.12.20.1600',
    timestamp: new Date('2024-12-08T11:20:00'),
    tags: ['上3', '下2', '关键节点'],
    status: 'active',
    metadata: {
      size: 78643200, // 75MB
      accuracy: 0.876,
      framework: 'PyTorch',
      description: '改进的RCNN目标检测模型，适用于工业质检',
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
    name: 'MobileNet-SSD',
    type: 'detection',
    version: 'v2023.11.30.1200',
    timestamp: new Date('2024-12-05T14:15:00'),
    tags: ['上4', '下3', '辅助区域'],
    status: 'archived',
    metadata: {
      size: 26214400, // 25MB
      accuracy: 0.734,
      framework: 'TensorFlow Lite',
      description: '轻量级移动端目标检测模型',
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
    name: 'U-Net-Medical',
    type: 'segmentation',
    version: 'v2023.10.15.0800',
    timestamp: new Date('2024-12-01T10:30:00'),
    tags: ['下4', '整体大块', '主要区域'],
    status: 'deprecated',
    metadata: {
      size: 67108864, // 64MB
      accuracy: 0.912,
      framework: 'Keras',
      description: '专用于医疗影像分割的U-Net模型',
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
    name: 'EfficientDet-D4',
    type: 'detection',
    version: 'v2024.01.08.1000',
    timestamp: new Date('2024-11-28T13:45:00'),
    tags: ['上1', '上2', '连接区域'],
    status: 'active',
    metadata: {
      size: 83886080, // 80MB
      accuracy: 0.901,
      framework: 'PyTorch',
      description: 'EfficientDet系列高效目标检测模型',
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
    name: 'Mask-RCNN-Instance',
    type: 'segmentation',
    version: 'v2023.12.01.1400',
    timestamp: new Date('2024-11-25T08:20:00'),
    tags: ['下1', '下2', '过渡区域'],
    status: 'active',
    metadata: {
      size: 157286400, // 150MB
      accuracy: 0.923,
      framework: 'PyTorch',
      description: 'Mask R-CNN实例分割模型，支持多目标检测和分割',
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
    name: 'YOLO-NAS-Detection',
    type: 'detection',
    version: 'v2024.01.20.0930',
    timestamp: new Date('2024-11-20T15:10:00'),
    tags: ['上3', '上4', '特殊区域'],
    status: 'active',
    metadata: {
      size: 94371840, // 90MB
      accuracy: 0.887,
      framework: 'PyTorch',
      description: '基于神经架构搜索的新一代YOLO检测模型',
      author: 'NAS Research Team',
      license: 'Apache 2.0',
      trainingDataset: 'COCO 2017 + Custom Dataset',
      inputShape: [3, 640, 640],
      outputShape: [8400, 84],
      parameters: 47020736
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
