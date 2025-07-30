/**
 * 版本号生成工具
 * 支持基于基础模型网络生成版本号
 */

// 基础模型网络类型
export type BaseModelType = 
  | 'bisegnet' 
  | 'sam' 
  | 'YOLOv8' 
  | 'YOLOv11' 
  | 'unet' 
  | 'deeplab' 
  | 'maskrcnn' 
  | 'fasterrcnn';

// 模型类型映射
export const MODEL_TYPE_MAP = {
  segmentation: ['bisegnet', 'sam', 'unet', 'deeplab', 'maskrcnn'] as BaseModelType[],
  detection: ['YOLOv8', 'YOLOv11', 'fasterrcnn'] as BaseModelType[]
};

/**
 * 生成版本号
 * @param baseModel 基础模型网络
 * @param sequenceNumber 序号
 * @returns 版本号字符串
 */
export function generateVersion(baseModel: BaseModelType, sequenceNumber: number): string {
  return `${baseModel}_${sequenceNumber}`;
}

/**
 * 解析版本号
 * @param version 版本号字符串
 * @returns 解析结果
 */
export function parseVersion(version: string): { baseModel: BaseModelType; sequenceNumber: number } | null {
  const match = version.match(/^([a-zA-Z0-9]+)_(\d+)$/);
  if (!match) return null;
  
  const [, baseModel, sequenceStr] = match;
  const sequenceNumber = parseInt(sequenceStr, 10);
  
  // 验证基础模型是否有效
  const allBaseModels = [...MODEL_TYPE_MAP.segmentation, ...MODEL_TYPE_MAP.detection];
  if (!allBaseModels.includes(baseModel as BaseModelType)) {
    return null;
  }
  
  return {
    baseModel: baseModel as BaseModelType,
    sequenceNumber
  };
}

/**
 * 获取下一个版本号
 * @param baseModel 基础模型网络
 * @param existingVersions 现有版本号列表
 * @returns 下一个版本号
 */
export function getNextVersion(baseModel: BaseModelType, existingVersions: string[]): string {
  const versions = existingVersions
    .map(v => parseVersion(v))
    .filter(v => v && v.baseModel === baseModel)
    .map(v => v!.sequenceNumber);
  
  const maxSequence = versions.length > 0 ? Math.max(...versions) : 0;
  return generateVersion(baseModel, maxSequence + 1);
}

/**
 * 根据模型类型获取推荐的基础模型
 * @param modelType 模型类型
 * @returns 推荐的基础模型列表
 */
export function getRecommendedBaseModels(modelType: 'segmentation' | 'detection'): BaseModelType[] {
  return MODEL_TYPE_MAP[modelType] || [];
}

/**
 * 验证版本号格式
 * @param version 版本号
 * @returns 是否有效
 */
export function isValidVersion(version: string): boolean {
  return parseVersion(version) !== null;
}

/**
 * 格式化版本号显示
 * @param version 版本号
 * @returns 格式化后的显示文本
 */
export function formatVersionDisplay(version: string): string {
  const parsed = parseVersion(version);
  if (!parsed) return version;
  
  return `${parsed.baseModel}_${parsed.sequenceNumber}`;
} 