/**
 * Input组件测试
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input/Input';

describe('Input', () => {
  it('should render input with value', () => {
    render(<Input value="test value" onChange={() => {}} />);
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Input value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('should show placeholder', () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should show error message', () => {
    render(<Input value="" onChange={() => {}} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should apply error class when error is present', () => {
    render(<Input value="" onChange={() => {}} error="Error message" />);
    expect(screen.getByRole('textbox').className).toMatch(/error/);
  });

  it('should support different input types', () => {
    const { rerender } = render(<Input value="" onChange={() => {}} type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input value="" onChange={() => {}} type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

    rerender(<Input value="123" onChange={() => {}} type="number" />);
    expect(screen.getByDisplayValue('123')).toHaveAttribute('type', 'number');
  });

  it('should apply custom className', () => {
    render(<Input value="" onChange={() => {}} className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });
});
