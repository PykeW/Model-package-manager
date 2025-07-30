/**
 * 类型定义入口文件
 */

export * from './model';
import type { Model } from './model';

// 通用UI组件类型
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  className?: string;
}

export interface TagProps {
  label: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

// 表格相关类型
export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  minWidth?: string; // 最小宽度，用于响应式布局
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

// 分页类型
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

// 搜索和筛选类型
export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export interface FilterProps {
  filters: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
  onReset?: () => void;
  className?: string;
}

// ================== 新增：方案和模型关联类型定义 ==================

/**
 * 运行方案接口定义
 * 表示一个AOI检测运行方案，可以关联多个AI模型
 */
export interface SchemeType {
  id: string;
  name: string;
  description?: string;
  associatedModels: string[]; // 关联的模型ID列表
  isActive: boolean; // 是否为当前活跃方案
  createdAt: string;
  updatedAt?: string;
  category?: string; // 方案类别（如：电子元件检测、医疗影像分析等）
  priority?: number; // 方案优先级
}

/**
 * 模型关联配置接口
 * 表示模型与方案的关联关系和配置
 */
export interface ModelAssociationType {
  modelId: string;
  schemeId: string;
  priority: number; // 关联优先级（1-10，数字越大优先级越高）
  associatedAt: string; // 关联时间
  isEnabled: boolean; // 是否启用该关联
  config?: {
    weight?: number; // 模型权重
    threshold?: number; // 阈值设置
    notes?: string; // 备注信息
  };
}

/**
 * 模型关联选择面板的Props接口
 */
export interface ModelAssociationPanelProps {
  currentScheme: SchemeType;
  availableModels: Model[];
  associatedModels: ModelAssociationType[];
  onAssociate: (modelIds: string[]) => void;
  onDisassociate: (modelIds: string[]) => void;
  onBack: () => void;
  loading?: boolean;
  showOnlyAssociated?: boolean;
}

/**
 * 模型选择状态接口
 */
export interface ModelSelectionState {
  selectedModels: Set<string>;
  selectAll: boolean;
}
