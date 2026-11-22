import React from 'react';
import { Badge, BadgeVariant } from './Badge';

export interface TitleProps {
  title: string;
  badge?: BadgeVariant;
  badgeLabel?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export const Title: React.FC<TitleProps> = ({
  title,
  badge,
  badgeLabel,
  className = '',
  as: Component = 'span',
}) => {
  return (
    <Component className={`bsh-title ${className}`.trim()}>
      {title}
      {badge && (
        <Badge variant={badge} label={badgeLabel} />
      )}
    </Component>
  );
};
