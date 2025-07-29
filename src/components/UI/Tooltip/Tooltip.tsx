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

    const minTooltipWidth = 260; // ModelPreview的最小宽度
    const minMargin = 20; // 最小边距

    // 优先选择垂直空间最大的位置（上或下）
    if (spaceBottom > spaceTop) {
      // 下方空间更大
      if (spaceBottom >= minMargin * 2) return 'bottom';
    } else {
      // 上方空间更大
      if (spaceTop >= minMargin * 2) return 'top';
    }

    // 如果垂直空间都不够，选择水平方向
    if (spaceRight >= minTooltipWidth + minMargin) return 'right';
    if (spaceLeft >= minTooltipWidth + minMargin) return 'left';

    // 默认选择空间最大的方向
    if (spaceBottom >= spaceTop) return 'bottom';
    return 'top';
  };

  const updateTooltipPosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    const tooltipContent = tooltip.querySelector('.tooltipContent') as HTMLElement;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const maxTooltipWidth = 420;
    const minTooltipWidth = 260;
    const margin = 20;

    // 首先让内容恢复自然高度以测量实际需要的空间
    if (tooltipContent) {
      tooltipContent.style.maxHeight = 'none';
      tooltipContent.style.overflowY = 'visible';
      tooltipContent.style.width = 'max-content';
    }

    // 延迟一帧来获取实际内容高度和宽度
    requestAnimationFrame(() => {
      const actualContentHeight = tooltipContent ? tooltipContent.scrollHeight + 32 : 400; // 加上padding
      const actualContentWidth = tooltipContent ? Math.min(tooltipContent.scrollWidth, maxTooltipWidth) : minTooltipWidth;
      
      let left = 0;
      let top = 0;
      let transform = '';
      let maxHeight = 'none';

      // 根据实际位置设置tooltip的位置
      switch (actualPosition) {
        case 'top': {
          left = container.left + container.width / 2;
          const availableTopSpace = container.top - margin;
          
          if (actualContentHeight <= availableTopSpace) {
            // 内容可以完全显示，不需要滚动
            top = container.top - margin;
            transform = 'translateX(-50%) translateY(-100%)';
            maxHeight = 'none';
          } else {
            // 内容超出可用空间，需要限制高度并启用滚动
            top = margin;
            transform = 'translateX(-50%)';
            maxHeight = `${availableTopSpace}px`;
          }
          
          // 水平边界检测
          if (left - actualContentWidth / 2 < margin) {
            left = actualContentWidth / 2 + margin;
          } else if (left + actualContentWidth / 2 > viewport.width - margin) {
            left = viewport.width - actualContentWidth / 2 - margin;
          }
          break;
        }
          
        case 'bottom': {
          left = container.left + container.width / 2;
          const availableBottomSpace = viewport.height - container.bottom - margin;
          
          if (actualContentHeight <= availableBottomSpace) {
            // 内容可以完全显示
            top = container.bottom + margin;
            transform = 'translateX(-50%)';
            maxHeight = 'none';
          } else {
            // 内容超出可用空间
            top = container.bottom + margin;
            transform = 'translateX(-50%)';
            maxHeight = `${availableBottomSpace}px`;
          }
          
          // 水平边界检测
          if (left - actualContentWidth / 2 < margin) {
            left = actualContentWidth / 2 + margin;
          } else if (left + actualContentWidth / 2 > viewport.width - margin) {
            left = viewport.width - actualContentWidth / 2 - margin;
          }
          break;
        }
          
        case 'left': {
          left = container.left - margin;
          top = container.top + container.height / 2;
          transform = 'translateX(-100%) translateY(-50%)';
          
          const availableLeftHeight = viewport.height - margin * 2;
          if (actualContentHeight > availableLeftHeight) {
            maxHeight = `${availableLeftHeight}px`;
            // 调整垂直位置确保不超出屏幕
            if (top - actualContentHeight / 2 < margin) {
              top = margin + actualContentHeight / 2;
            } else if (top + actualContentHeight / 2 > viewport.height - margin) {
              top = viewport.height - margin - actualContentHeight / 2;
            }
          }
          break;
        }
          
        case 'right': {
          left = container.right + margin;
          top = container.top + container.height / 2;
          transform = 'translateY(-50%)';
          
          const availableRightHeight = viewport.height - margin * 2;
          if (actualContentHeight > availableRightHeight) {
            maxHeight = `${availableRightHeight}px`;
            // 调整垂直位置确保不超出屏幕
            if (top - actualContentHeight / 2 < margin) {
              top = margin + actualContentHeight / 2;
            } else if (top + actualContentHeight / 2 > viewport.height - margin) {
              top = viewport.height - margin - actualContentHeight / 2;
            }
          }
          break;
        }
      }

      // 移动端特殊处理
      const isMobile = viewport.width <= 768;
      if (isMobile) {
        // 移动端固定在屏幕中央显示
        left = viewport.width / 2;
        top = Math.min(container.bottom + margin, viewport.height / 2);
        transform = 'translateX(-50%) translateY(-50%)';
        
        const availableMobileHeight = viewport.height - 40;
        if (actualContentHeight > availableMobileHeight) {
          maxHeight = `${availableMobileHeight}px`;
        }
      }

      // 应用位置和样式
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.transform = transform;
      
      // 应用高度限制和滚动设置
      if (tooltipContent) {
        if (maxHeight === 'none') {
          tooltipContent.style.maxHeight = 'none';
          tooltipContent.style.overflowY = 'visible';
        } else {
          tooltipContent.style.maxHeight = maxHeight;
          tooltipContent.style.overflowY = 'auto';
        }
      }
    });
  };

  const showTooltipContent = () => {
    const optimalPosition = calculateOptimalPosition();
    setActualPosition(optimalPosition);
    setIsVisible(true);
    setShowTooltip(true);
    // 延迟一帧来确保DOM更新后再设置位置
    requestAnimationFrame(() => {
      updateTooltipPosition();
    });
  };

  const hideTooltipContent = () => {
    setIsVisible(false);
    setShowTooltip(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      showTooltipContent();
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    hideTooltipContent();
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
