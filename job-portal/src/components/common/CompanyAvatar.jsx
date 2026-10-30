import React from 'react';

export default function CompanyAvatar({ name = '', logo = '', color = '#2563eb', size = 48, className = '' }) {
  const initials = logo || (name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JN');

  return (
    <div
      className={`company-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color || '#2563eb',
        fontSize: `${Math.round(size * 0.38)}px`
      }}
      title={name}
      aria-label={`${name} company logo`}
    >
      <span className="avatar-text">{initials}</span>
    </div>
  );
}
