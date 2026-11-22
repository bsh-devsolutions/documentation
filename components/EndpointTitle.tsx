import React from 'react';
import { Badge, BadgeVariant } from './Badge';
import { HttpMethod } from './HttpMethod';

export interface EndpointTitleProps {
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  badge?: BadgeVariant;
  badgeLabel?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export const EndpointTitle: React.FC<EndpointTitleProps> = ({
  title,
  method,
  badge,
  badgeLabel,
  className = '',
  as: Component = 'span',
}) => {
  return (
    <Component className={`bsh-title ${className}`.trim()}>
      <HttpMethod method={method} /> {title}
      {badge && (
        <Badge variant={badge} label={badgeLabel} />
      )}
    </Component>
  );
};
