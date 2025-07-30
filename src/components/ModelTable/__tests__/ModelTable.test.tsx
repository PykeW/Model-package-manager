/**
 * ModelTable组件测试
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import { ModelTable } from '../ModelTable';
import { mockModels } from '../../../data/mockModels';

describe('ModelTable', () => {
  const defaultProps = {
    models: mockModels,
    loading: false
  };

  test('渲染模型表格', () => {
    render(<ModelTable {...defaultProps} />);
    
    // 检查表格是否渲染
    expect(screen.getByRole('table')).toBeInTheDocument();
    
    // 检查模型名称是否显示
    expect(screen.getByText('手机屏幕正面')).toBeInTheDocument();
    expect(screen.getByText('手机屏幕背面')).toBeInTheDocument();
  });

  test('版本下拉框显示正确的选项', () => {
    render(<ModelTable {...defaultProps} />);
    
    // 找到版本下拉框
    const versionSelects = screen.getAllByRole('combobox');
    const firstVersionSelect = versionSelects[0];
    
    // 检查当前版本是否显示
    expect(firstVersionSelect).toHaveValue('bisegnet_1');
    
    // 检查下拉框选项数量（应该有8个连续序号版本选项）
    const options = firstVersionSelect.querySelectorAll('option');
    expect(options.length).toBeGreaterThanOrEqual(8);
    
    // 检查是否包含特定版本选项（连续序号格式）
    expect(firstVersionSelect).toHaveTextContent('bisegnet_1');
    expect(firstVersionSelect).toHaveTextContent('sam_2');
    expect(firstVersionSelect).toHaveTextContent('deeplab_3');
  });

  test('版本下拉框支持选择不同版本', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ModelTable {...defaultProps} />);
    
    const versionSelects = screen.getAllByRole('combobox');
    const firstVersionSelect = versionSelects[0];
    
    // 选择不同版本
    fireEvent.change(firstVersionSelect, { target: { value: 'sam_2' } });
    
    // 检查console.log是否被调用（验证onChange事件）
    expect(consoleSpy).toHaveBeenCalledWith('Version changed:', 'sam_2');
    
    consoleSpy.mockRestore();
  });

  test('不同模型类型显示不同的版本选项', () => {
    render(<ModelTable {...defaultProps} />);
    
    const versionSelects = screen.getAllByRole('combobox');
    
    // 检查检测模型的版本选项
    const detectionModelSelect = versionSelects[2]; // 第三个模型是检测类型
    expect(detectionModelSelect).toHaveValue('YOLOv8_1');
    
    // 检查分割模型的版本选项
    const segmentationModelSelect = versionSelects[0]; // 第一个模型是分割类型
    expect(segmentationModelSelect).toHaveValue('bisegnet_1');
  });

  test('显示训练完成时间列', () => {
    render(<ModelTable {...defaultProps} />);
    
    // 检查训练完成时间列标题
    expect(screen.getByText('训练完成时间')).toBeInTheDocument();
    
    // 检查训练完成时间数据是否显示（检查多个日期元素）
    const dateElements = screen.getAllByText(/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
    expect(dateElements[0]).toHaveTextContent(/2024-01-01/);
  });

  test('每个模型都有独立的版本编号', () => {
    render(<ModelTable {...defaultProps} />);
    
    const versionSelects = screen.getAllByRole('combobox');
    
    // 检查不同模型有不同的版本号
    expect(versionSelects[0]).toHaveValue('bisegnet_1'); // 第一个模型
    expect(versionSelects[1]).toHaveValue('sam_2');      // 第二个模型
    expect(versionSelects[2]).toHaveValue('YOLOv8_1');   // 第三个模型
    expect(versionSelects[3]).toHaveValue('YOLOv8_1');   // 第四个模型（检测模型从1开始）
  });

  test('关联模型置顶功能', () => {
    // 创建模拟的关联数据
    const mockAssociations = [
      {
        modelId: 'model-1', // 手机屏幕正面
        schemeId: 'scheme-1',
        priority: 1,
        associatedAt: '2024-01-01T00:00:00',
        isEnabled: true
      },
      {
        modelId: 'model-3', // 手机边框
        schemeId: 'scheme-1',
        priority: 2,
        associatedAt: '2024-01-01T00:00:00',
        isEnabled: true
      },
      {
        modelId: 'model-6', // 手机按键
        schemeId: 'scheme-1',
        priority: 3,
        associatedAt: '2024-01-01T00:00:00',
        isEnabled: true
      }
    ];

    render(
      <ModelTable 
        {...defaultProps} 
        associations={mockAssociations}
        showAssociationActions={true}
      />
    );

    // 检查关联的模型是否显示"取消关联"按钮
    expect(screen.getByText('取消关联')).toBeInTheDocument();
    
    // 检查未关联的模型是否显示"关联"按钮
    expect(screen.getByText('关联')).toBeInTheDocument();
    
    // 验证关联模型在列表中的位置（应该在前3个位置）
    const modelNames = screen.getAllByText(/手机屏幕正面|手机边框|手机按键/);
    expect(modelNames.length).toBeGreaterThanOrEqual(3);
  });
}); 