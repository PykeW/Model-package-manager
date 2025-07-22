/**
 * 格式化工具函数测试
 */

import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatDate,
  generateVersion,
  truncateText,
  generateId,
  deepClone
} from '../format';

describe('formatFileSize', () => {
  it('should format bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });
});

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(123)).toBe('123');
  });
});

describe('formatPercentage', () => {
  it('should format percentages correctly', () => {
    expect(formatPercentage(0.5)).toBe('50.00%');
    expect(formatPercentage(0.123)).toBe('12.30%');
    expect(formatPercentage(0.123, 1)).toBe('12.3%');
    expect(formatPercentage(1)).toBe('100.00%');
  });
});

describe('formatDate', () => {
  it('should format dates correctly', () => {
    const date = new Date('2024-01-15T14:30:00');
    const formatted = formatDate(date);
    expect(formatted).toMatch(/2024-01-15/);
  });
});

describe('generateVersion', () => {
  it('should generate version string', () => {
    const version = generateVersion(new Date('2024-01-15T14:30:00'));
    expect(version).toBe('v2024.01.15.1430');
  });
});

describe('truncateText', () => {
  it('should truncate text correctly', () => {
    expect(truncateText('Hello World', 5)).toBe('He...');
    expect(truncateText('Hello', 10)).toBe('Hello');
    expect(truncateText('Hello World', 5, '***')).toBe('He***');
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
  });
});

describe('deepClone', () => {
  it('should deep clone objects', () => {
    const original = {
      name: 'test',
      nested: { value: 42 },
      array: [1, 2, 3],
      date: new Date('2024-01-01')
    };
    
    const cloned = deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.nested).not.toBe(original.nested);
    expect(cloned.array).not.toBe(original.array);
    expect(cloned.date).not.toBe(original.date);
  });

  it('should handle primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });
});
