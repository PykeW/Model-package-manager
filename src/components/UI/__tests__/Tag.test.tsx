/**
 * Tag组件测试
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from '../Tag/Tag';

describe('Tag', () => {
  it('should render tag with label', () => {
    render(<Tag label="Test Tag" />);
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
  });

  it('should apply color classes', () => {
    const { rerender } = render(<Tag label="Primary" color="primary" />);
    expect(screen.getByText('Primary').parentElement?.className).toMatch(/primary/);

    rerender(<Tag label="Secondary" color="secondary" />);
    expect(screen.getByText('Secondary').parentElement?.className).toMatch(/secondary/);

    rerender(<Tag label="Success" color="success" />);
    expect(screen.getByText('Success').parentElement?.className).toMatch(/success/);
  });

  it('should show remove button when removable', () => {
    render(<Tag label="Removable" removable />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByLabelText('移除标签 Removable')).toBeInTheDocument();
  });

  it('should not show remove button when not removable', () => {
    render(<Tag label="Not Removable" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should handle remove action', () => {
    const handleRemove = vi.fn();
    render(<Tag label="Remove Me" removable onRemove={handleRemove} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('should stop propagation on remove button click', () => {
    const handleRemove = vi.fn();
    const handleTagClick = vi.fn();
    
    render(
      <div onClick={handleTagClick}>
        <Tag label="Test" removable onRemove={handleRemove} />
      </div>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleTagClick).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Tag label="Custom" className="custom-tag" />);
    expect(screen.getByText('Custom').parentElement?.className).toMatch(/custom-tag/);
  });

  it('should apply removable class when removable', () => {
    render(<Tag label="Removable" removable />);
    expect(screen.getByText('Removable').parentElement?.className).toMatch(/removable/);
  });
});
