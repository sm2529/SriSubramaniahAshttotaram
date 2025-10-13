'use client';

type BookmarkIconProps = {
  filled?: boolean;
  className?: string;
};

export function BookmarkIcon({ filled = false, className }: BookmarkIconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6.75 3.75h10.5a.75.75 0 0 1 .75.75v15l-5.25-3.15a.75.75 0 0 0-.75 0L6 19.5V4.5a.75.75 0 0 1 .75-.75z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
