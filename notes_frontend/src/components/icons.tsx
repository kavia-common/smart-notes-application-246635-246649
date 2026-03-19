import React from "react";

type IconProps = { className?: string; title?: string };

// PUBLIC_INTERFACE
export function SunIcon({ className, title }: IconProps) {
  /** Sun icon. */
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-14.5a1 1 0 0 1 1 1V6a1 1 0 1 1-2 0V4.5a1 1 0 0 1 1-1ZM12 18a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V19a1 1 0 0 1 1-1Zm8.5-6a1 1 0 0 1-1 1H18a1 1 0 1 1 0-2h1.5a1 1 0 0 1 1 1ZM6 12a1 1 0 0 1-1 1H3.5a1 1 0 1 1 0-2H5a1 1 0 0 1 1 1Zm12.02-6.52a1 1 0 0 1 0 1.42l-1.06 1.06a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0ZM8.46 15.04a1 1 0 0 1 0 1.42L7.4 17.52a1 1 0 1 1-1.42-1.42l1.06-1.06a1 1 0 0 1 1.42 0Zm9.56 2.48a1 1 0 0 1-1.42 0l-1.06-1.06a1 1 0 0 1 1.42-1.42l1.06 1.06a1 1 0 0 1 0 1.42ZM8.46 8.96a1 1 0 0 1-1.42 0L5.98 7.9A1 1 0 1 1 7.4 6.48l1.06 1.06a1 1 0 0 1 0 1.42Z"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function MoonIcon({ className, title }: IconProps) {
  /** Moon icon. */
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3a.9.9 0 0 0-1.11 1.11A6.7 6.7 0 0 0 17.89 13.6.9.9 0 0 0 19 12.5 8.5 8.5 0 0 1 21 14.5Z"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function PinIcon({ className, title }: IconProps) {
  /** Pin icon. */
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M14 2l8 8-3 3v5h-5l-3 3-1-1 3-3v-5L2 6l12-4Zm-2.1 4.1-3.8 1.3 5.4 5.4V9.9l-1.6-3.8Z"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function StarIcon({ className, title }: IconProps) {
  /** Star/favorite icon. */
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M12 17.3 6.18 20.5l1.12-6.54L2.5 9.5l6.6-.96L12 2.5l2.9 6.04 6.6.96-4.8 4.46 1.12 6.54L12 17.3Z"
      />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function TrashIcon({ className, title }: IconProps) {
  /** Trash/delete icon. */
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M9 3h6l1 2h5v2H3V5h5l1-2Zm1 6h2v9h-2V9Zm4 0h2v9h-2V9ZM6 9h2v9H6V9Z"
      />
    </svg>
  );
}
