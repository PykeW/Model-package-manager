/**
 * 模型表格Hook - 管理表格状态和操作
 */

import { useState, useMemo } from 'react';
import type { Model, ModelFilter, ModelSort } from '../types';

export interface UseModelTableProps {
  models: Model[];
  initialFilter?: ModelFilter;
  initialSort?: ModelSort;
}

export interface UseModelTableReturn {
  filteredModels: Model[];
  filter: ModelFilter;
  sort: ModelSort | null;
  setFilter: (filter: ModelFilter) => void;
  setSort: (sort: ModelSort | null) => void;
  resetFilter: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useModelTable = ({
  models,
  initialFilter = {},
  initialSort
}: UseModelTableProps): UseModelTableReturn => {
  const [filter, setFilter] = useState<ModelFilter>(initialFilter);
  const [sort, setSort] = useState<ModelSort | null>(initialSort || null);
  const [searchTerm, setSearchTerm] = useState(filter.searchTerm || '');

  // 过滤和排序逻辑
  const filteredModels = useMemo(() => {
    let result = [...models];

    // 应用搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(model =>
        model.name.toLowerCase().includes(term) ||
        model.metadata.description?.toLowerCase().includes(term) ||
        model.metadata.framework.toLowerCase().includes(term) ||
        model.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // 应用类型过滤
    if (filter.type) {
      result = result.filter(model => model.type === filter.type);
    }

    // 应用状态过滤
    if (filter.status) {
      result = result.filter(model => model.status === filter.status);
    }

    // 应用标签过滤
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(model =>
        filter.tags!.some(tag => model.tags.includes(tag))
      );
    }

    // 应用排序
    if (sort) {
      result.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // 获取排序字段的值
        if (sort.field in a) {
          aValue = a[sort.field as keyof Model];
          bValue = b[sort.field as keyof Model];
        } else if (sort.field in a.metadata) {
          aValue = a.metadata[sort.field as keyof typeof a.metadata];
          bValue = b.metadata[sort.field as keyof typeof b.metadata];
        } else {
          return 0;
        }

        // 处理不同类型的值
        if (aValue instanceof Date && bValue instanceof Date) {
          return sort.direction === 'asc' 
            ? aValue.getTime() - bValue.getTime()
            : bValue.getTime() - aValue.getTime();
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sort.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        // 默认字符串比较
        const aStr = String(aValue);
        const bStr = String(bValue);
        return sort.direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [models, filter, sort, searchTerm]);

  const handleSetFilter = (newFilter: ModelFilter) => {
    setFilter(newFilter);
    if (newFilter.searchTerm !== undefined) {
      setSearchTerm(newFilter.searchTerm);
    }
  };

  const resetFilter = () => {
    setFilter({});
    setSearchTerm('');
    setSort(null);
  };

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    setFilter(prev => ({ ...prev, searchTerm: term }));
  };

  return {
    filteredModels,
    filter,
    sort,
    setFilter: handleSetFilter,
    setSort,
    resetFilter,
    searchTerm,
    setSearchTerm: handleSetSearchTerm
  };
};
