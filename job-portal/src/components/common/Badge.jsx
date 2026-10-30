import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  // variants: 'primary', 'success', 'warning', 'danger', 'info', 'purple', 'neutral', 'outline'
  return (
    <span className={`badge-pill badge-${variant} badge-${size} ${className}`}>
      {children}
    </span>
  );
}
