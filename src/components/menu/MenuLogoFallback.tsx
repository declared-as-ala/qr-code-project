export function MenuLogoFallback({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Steam wisps */}
      <path
        d="M15 12 C14.2 9.8 15.8 8.2 15 6"
        stroke="#C9881A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 12 C23.2 9.8 24.8 8.2 24 6"
        stroke="#C9881A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 12 C32.2 9.8 33.8 8.2 33 6"
        stroke="#C9881A"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cup body — trapezoidal, tapers toward base */}
      <path
        d="M9 16H39L35.5 36.5H12.5L9 16Z"
        fill="#2D1E10"
      />

      {/* Crema — golden liquid surface at cup top */}
      <ellipse
        cx="24"
        cy="17.2"
        rx="13.2"
        ry="2.2"
        fill="url(#crema)"
        opacity="0.85"
      />

      {/* Handle */}
      <path
        d="M39 20C46 20 46 32 39 32"
        stroke="#2D1E10"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Saucer */}
      <ellipse
        cx="24"
        cy="38.5"
        rx="17"
        ry="3"
        fill="url(#saucer)"
        opacity="0.55"
      />

      <defs>
        <radialGradient id="crema" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#F5D78A" />
          <stop offset="55%" stopColor="#C9881A" />
          <stop offset="100%" stopColor="#9D6410" />
        </radialGradient>
        <linearGradient id="saucer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9881A" stopOpacity="0" />
          <stop offset="30%" stopColor="#C9881A" />
          <stop offset="70%" stopColor="#C9881A" />
          <stop offset="100%" stopColor="#C9881A" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
