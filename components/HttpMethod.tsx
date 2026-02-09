import React from 'react';

export type BadgeVariant = 'soon' | 'new' | 'beta' | 'deprecated' | 'experimental' | 'planned';

export interface HttpMethodProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

const httpMethodVariants = {
  GET: {
    background: '#e8f1fd',
    color: '#1565c0',
    border: '1px solid #90caf9',
  },
  POST: {
    background: '#e8f9ee',
    color: '#2e7d32',
    border: '1px solid #81c784',
  },
  PUT: {
    background: '#fffbe7',
    color: '#bc8c12',
    border: '1px solid #ffe082',
  },
  DELETE: {
    background: '#fdecea',
    color: '#b71c1c',
    border: '1px solid #ef9a9a',
  },
};

export const HttpMethod: React.FC<HttpMethodProps> = ({
                                                        method,
                                                      }) => {
  const variantStyles = httpMethodVariants[method];

  const httpMethodStyle: React.CSSProperties = {
    color: variantStyles.color,
    background: variantStyles.background,
    border: variantStyles.border,
    fontWeight: 600,
    padding: '2px 4px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
    fontSize: '0.5rem',
  };

  return (
      <span style={httpMethodStyle}>
      {method}
    </span>
  );
};