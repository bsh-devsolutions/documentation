import React from 'react';

export type BadgeVariant = 'soon' | 'new' | 'updated' | 'beta' | 'deprecated' | 'experimental' | 'planned';

export interface BadgeProps {
  label?: string;
  variant?: BadgeVariant;
  customColor?: string;
  customBackground?: string;
  className?: string;
}

const badgeVariants = {
  soon: {
    background: '#007bff1a',
    color: '#007bff',
  },
  new: {
    background: '#28a7451a',
    color: '#28a745',
  },
  updated: {
    background: '#0d6efd1a',
    color: '#0a58ca',
  },
  beta: {
    background: '#7C3AED1A',
    color: '#7C3AED',
  },
  deprecated: {
    background: '#dc35451a',
    color: '#dc3545',
  },
  experimental: {
    background: '#6f42c11a',
    color: '#6f42c1',
  },
  planned: {
    background: '#6c757d1a',
    color: '#6c757d',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'soon',
  customColor,
  customBackground,
  className = '',
}) => {
  const variantStyles = badgeVariants[variant];
  const displayLabel = label ?? variant;

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
      {displayLabel}
    </span>
  );
};
