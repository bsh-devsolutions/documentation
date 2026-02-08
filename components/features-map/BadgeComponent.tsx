import React from 'react';

export type BadgeVariant =
  | 'deprecated'
  | 'backlog'
  | 'inprogress'
  | 'released'
  | 'beta'
  | 'experimental';

export interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  customColor?: string;
  customBackground?: string;
  className?: string;
}

const badgeVariants = {
  deprecated: {
    background: '#dc35451a',
    color: '#dc3545',
  },
  backlog: {
    background: '#6c757d1a',
    color: '#6c757d',
  },
  inprogress: {
    background: '#f59e0b1a',
    color: '#f59e0b',
  },
  released: {
    background: '#10b9811a',
    color: '#10b981',
  },
  beta: {
    background: '#7C3AED1A',
    color: '#7C3AED',
  },
  experimental: {
    background: '#6f42c11a',
    color: '#6f42c1',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'backlog',
  customColor,
  customBackground,
  className = '',
}) => {
  const variantStyles = badgeVariants[variant];

  const badgeStyle: React.CSSProperties = {
    background: customBackground || variantStyles.background,
    color: customColor || variantStyles.color,
    borderRadius: '1000px',
    padding: '0px 6px',
    fontSize: '0.85em',
    marginLeft: '8px',
    verticalAlign: 'middle',
    fontWeight: 500,
    display: 'inline-block',
  };

  return (
    <span style={badgeStyle} className={className}>
      {label || variant}
    </span>
  );
};
