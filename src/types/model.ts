/**
 * 模型接口定义
 * 定义AI模型的数据结构和相关类型
 */

export interface Model extends Record<string, unknown> {
  id: string;
  name: string;
  type: 'segmentation' | 'detection';
  version: string;
  timestamp: Date;
  tags: string[];
  status: 'active' | 'archived' | 'deprecated';
  metadata: ModelMetadata;
}

export interface ModelMetadata {
  size: number; // 模型文件大小（字节）
  accuracy: number; // 模型准确率（0-1）
  framework: string; // 框架名称（如 TensorFlow, PyTorch）
  description?: string; // 模型描述
  author?: string; // 作者
  license?: string; // 许可证
  trainingDataset?: string; // 训练数据集
  inputShape?: number[]; // 输入形状
  outputShape?: number[]; // 输出形状
  parameters?: number; // 参数数量
}

export type ModelType = Model['type'];
export type ModelStatus = Model['status'];

export interface ModelFilter {
  type?: ModelType;
  status?: ModelStatus;
  tags?: string[];
  searchTerm?: string;
}

export interface ModelSort {
  field: keyof Model | keyof ModelMetadata;
  direction: 'asc' | 'desc';
}

export interface ModelFormData {
  name: string;
  type: ModelType;
  tags: string[];
  status: ModelStatus;
  metadata: Partial<ModelMetadata>;
}

export interface ModelTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, model: Model) => React.ReactNode;
}
