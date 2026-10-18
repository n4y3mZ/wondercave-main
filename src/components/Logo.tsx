import React from "react";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 20L100 40V80L60 100L20 80V40L60 20Z"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d="M60 20V55L90 70"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M60 55L30 70"
        stroke="#FF5A36"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="55" r="8" fill="#FF5A36" />
    </svg>
  );
}
