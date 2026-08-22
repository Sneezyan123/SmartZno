"use client";

export function LessonBear() {
  return (
    <div className="pointer-events-none flex justify-end" aria-hidden>
      <svg
        viewBox="0 0 96 108"
        className="h-[4.5rem] w-[4.5rem] origin-bottom animate-[bear-float_3.4s_ease-in-out_infinite] drop-shadow-[0_8px_12px_rgba(80,48,20,0.22)] md:h-20 md:w-20"
      >
        <ellipse cx="48" cy="100" rx="22" ry="5" fill="#c4a574" opacity="0.35" />
        <circle cx="22" cy="28" r="14" fill="#8a5a32" />
        <circle cx="74" cy="28" r="14" fill="#8a5a32" />
        <circle cx="22" cy="28" r="7" fill="#e8c4a0" />
        <circle cx="74" cy="28" r="7" fill="#e8c4a0" />
        <ellipse cx="48" cy="58" rx="32" ry="30" fill="#8a5a32" />
        <ellipse cx="48" cy="64" rx="20" ry="16" fill="#f0d2b0" />
        <ellipse cx="48" cy="72" rx="9" ry="7" fill="#5c3a22" />
        <circle cx="36" cy="54" r="4.2" fill="#2a1a10" />
        <circle cx="60" cy="54" r="4.2" fill="#2a1a10" />
        <circle cx="37.2" cy="52.6" r="1.3" fill="#fff" />
        <circle cx="61.2" cy="52.6" r="1.3" fill="#fff" />
        <path d="M42 80c2.4 3 5.2 4.5 6 4.5S51.6 83 54 80" fill="none" stroke="#5c3a22" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
