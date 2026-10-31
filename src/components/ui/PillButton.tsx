import React from 'react';

type PillButtonProps = {
  href: string;
  children: string;
  variant?: 'solid' | 'glass';
  icon?: React.ReactNode;
};

export function PillButton({ href, children, variant = 'solid', icon }: PillButtonProps) {
  const base =
    'group relative inline-flex items-center gap-3 overflow-hidden whitespace-nowrap rounded-full py-3 pl-6 text-sm font-semibold transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-silver focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

  const styles =
    variant === 'solid'
      ? 'bg-ink text-bg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_14px_40px_-10px_rgba(245,158,11,0.55)]'
      : 'border border-ink/15 bg-bg/40 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_-15px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:border-amber-500/50';

  return (
    <a href={href} className={`${base} ${styles} ${icon ? 'pr-2' : 'pr-6'}`}>
      {/* solid: gradient fades in on hover */}
      {variant === 'solid' && (
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-400 to-teal-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      {/* glass: top highlight + shine sweep */}
      {variant === 'glass' && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-ink/30 to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-ink/10 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[120%] group-hover:opacity-100"
          />
        </>
      )}

      <span className="relative block overflow-hidden">
        <span
          className={`block transition-[transform,color] duration-300 ease-out-expo group-hover:-translate-y-full ${
            variant === 'solid' ? 'group-hover:text-white' : ''
          }`}
        >
          {children}
        </span>
        <span
          aria-hidden
          className={`absolute inset-0 block translate-y-full transition-[transform,color] duration-300 ease-out-expo group-hover:translate-y-0 ${
            variant === 'solid' ? 'group-hover:text-white' : ''
          }`}
        >
          {children}
        </span>
      </span>

      {icon && (
        <span
          className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-out-expo group-hover:-rotate-45 ${
            variant === 'solid'
              ? 'bg-bg text-ink'
              : 'bg-ink text-bg shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)]'
          }`}
        >
          {icon}
        </span>
      )}
    </a>
  );
}