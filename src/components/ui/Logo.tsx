import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label="Go to top"
      className={`inline-flex items-center gap-3 ${className}`}
    >
      <img
        src="/images/logo.png"
        alt="Bong Tong logo"
        width={40}
        height={40}
        className="h-9 w-auto object-contain md:h-10"
      />
    </a>
  );
}