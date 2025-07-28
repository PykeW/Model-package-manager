import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  delay = 500,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateOptimalPosition = () => {
    if (!containerRef.current) return position;

    const container = containerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // 检查各个方向是否有足够空间
    const spaceTop = container.top;
    const spaceBottom = viewport.height - container.bottom;
    const spaceLeft = container.left;
    const spaceRight = viewport.width - container.right;

    const tooltipWidth = 300; // ModelPreview的宽度
    const tooltipHeight = 450; // 估计的高度

    // 根据可用空间选择最佳位置
    if (position === 'top' && spaceTop >= tooltipHeight) {
      return 'top';
    } else if (position === 'bottom' && spaceBottom >= tooltipHeight) {
      return 'bottom';
    } else if (position === 'left' && spaceLeft >= tooltipWidth) {
      return 'left';
    } else if (position === 'right' && spaceRight >= tooltipWidth) {
      return 'right';
    }

    // 如果首选位置不可用，选择空间最大的位置
    if (spaceTop >= tooltipHeight) return 'top';
    if (spaceBottom >= tooltipHeight) return 'bottom';
    if (spaceRight >= tooltipWidth) return 'right';
    if (spaceLeft >= tooltipWidth) return 'left';

    // 默认返回top
    return 'top';
  };

  const updateTooltipPosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;

    // 根据实际位置设置tooltip的位置
    switch (actualPosition) {
      case 'top':
        tooltip.style.left = `${container.left + container.width / 2}px`;
        tooltip.style.top = `${container.top - 10}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
        break;
      case 'bottom':
        tooltip.style.left = `${container.left + container.width / 2}px`;
        tooltip.style.top = `${container.bottom + 10}px`;
        tooltip.style.transform = 'translateX(-50%)';
        break;
      case 'left':
        tooltip.style.left = `${container.left - 10}px`;
        tooltip.style.top = `${container.top + container.height / 2}px`;
        tooltip.style.transform = 'translateX(-100%) translateY(-50%)';
        break;
      case 'right':
        tooltip.style.left = `${container.right + 10}px`;
        tooltip.style.top = `${container.top + container.height / 2}px`;
        tooltip.style.transform = 'translateY(-50%)';
        break;
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    timeoutRef.current = window.setTimeout(() => {
      const optimalPosition = calculateOptimalPosition();
      setActualPosition(optimalPosition);
      setShowTooltip(true);
      // 延迟一帧来确保DOM更新后再设置位置
      requestAnimationFrame(() => {
        updateTooltipPosition();
      });
    }, delay);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setShowTooltip(false);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.tooltipContainer} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${styles[actualPosition]} ${
            showTooltip ? styles.visible : ''
          }`}
        >
          <div className={styles.tooltipContent}>
            {content}
          </div>
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
};
