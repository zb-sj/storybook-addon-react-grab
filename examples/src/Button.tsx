import React from 'react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function Button({ variant = 'primary', size = 'md', disabled, children, onClick }: ButtonProps) {
  return (
    <button data-testid="the-button" disabled={disabled} onClick={onClick}
      style={{ padding: size === 'sm' ? '4px 8px' : '8px 16px' }}>
      {children}
    </button>
  );
}
