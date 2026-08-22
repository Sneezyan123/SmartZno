const specks = [
  { className: "top-[16%] left-[28%] h-1.5 w-1.5 bg-white/25", delay: "0s", kind: "pulse" },
  { className: "top-[24%] left-[48%] h-1 w-1 bg-play/50", delay: "0.6s", kind: "pulse" },
  { className: "top-[12%] right-[38%] h-1.5 w-1.5 bg-brand-blue/45", delay: "1.1s", kind: "pulse" },
  { className: "top-[38%] left-[38%] h-1 w-1 bg-white/20", delay: "1.8s", kind: "drift" },
  { className: "top-[62%] left-[22%] h-1.5 w-1.5 bg-play/40", delay: "0.4s", kind: "drift" },
  { className: "top-[70%] left-[44%] h-1 w-1 bg-brand-blue/40", delay: "2.2s", kind: "pulse" },
  { className: "top-[46%] right-[12%] h-1.5 w-1.5 bg-white/20", delay: "0.9s", kind: "drift" },
  { className: "top-[22%] right-[18%] h-1 w-1 bg-play/35", delay: "1.5s", kind: "pulse" },
  { className: "bottom-[28%] right-[28%] h-1.5 w-1.5 bg-brand-blue/35", delay: "0.2s", kind: "drift" },
  { className: "bottom-[36%] left-[8%] h-1 w-1 bg-white/25", delay: "2.6s", kind: "pulse" },
] as const;

export function HeroDecor() {
  return (
    <div className="hero-dots pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <span className="hero-orb hero-orb-blue" />
      <span className="hero-orb hero-orb-lime" />
      <span className="hero-orb hero-orb-soft" />

      <svg
        className="hero-float absolute top-[18%] left-[14%] h-7 w-7 text-play"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 1.6 14.4 8.4 21.5 9l-5.5 4.6 1.8 7-5.8-3.8-5.8 3.8 1.8-7L2.5 9l7.1-.6L12 1.6Z" />
      </svg>

      <svg
        className="hero-spin-slow absolute top-[14%] left-[42%] h-10 w-10 text-white/15"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="16" cy="16" r="13" strokeDasharray="3 6" />
      </svg>

      <svg
        className="hero-drift-slow absolute top-[42%] left-[6%] h-5 w-5 text-brand-blue/80"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M8 2v12M2 8h12" />
      </svg>

      <svg
        className="hero-float absolute top-[58%] right-[14%] hidden h-6 w-6 text-play/70 sm:block"
        style={{ animationDelay: "1.2s" }}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 1.6 14.4 8.4 21.5 9l-5.5 4.6 1.8 7-5.8-3.8-5.8 3.8 1.8-7L2.5 9l7.1-.6L12 1.6Z" />
      </svg>

      <svg
        className="hero-drift absolute top-[28%] right-[8%] hidden h-4 w-4 text-brand-blue/55 sm:block"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M8 2v12M2 8h12" />
      </svg>

      <span className="hero-pulse absolute top-[58%] left-[12%] h-2.5 w-2.5 rounded-full bg-play/70" />
      <span className="hero-drift-slow absolute top-[30%] left-[8%] h-2 w-2 rounded-full bg-white/20" />
      <span className="hero-pulse absolute bottom-[34%] left-[16%] h-1.5 w-1.5 rounded-full bg-brand-blue/50" style={{ animationDelay: "1.4s" }} />

      {specks.map((speck) => (
        <span
          key={speck.className}
          className={`absolute rounded-full ${speck.className} ${speck.kind === "pulse" ? "hero-pulse" : "hero-drift"}`}
          style={{ animationDelay: speck.delay }}
        />
      ))}

      <svg
        className="absolute bottom-[22%] left-[-2%] hidden h-48 w-[26rem] text-white/18 sm:block"
        viewBox="0 0 420 220"
        fill="none"
      >
        <path
          d="M24 176 C 110 128, 168 198, 286 92"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="6 9"
          strokeLinecap="round"
        />
        <circle r="3" fill="#9dff57">
          <animateMotion
            dur="7.5s"
            repeatCount="indefinite"
            path="M24 176 C 110 128, 168 198, 286 92"
            calcMode="linear"
          />
        </circle>
        <g transform="translate(286 92)">
          <circle
            className="hero-waypoint-ring"
            r="18"
            fill="none"
            stroke="#5b8cff"
            strokeWidth="1.4"
            opacity="0.35"
          />
          <circle r="10" fill="#111318" stroke="#5b8cff" strokeWidth="1.6" />
          <circle r="4" fill="#9dff57" />
        </g>
      </svg>

      <svg
        className="absolute inset-x-0 bottom-0 h-[4.5rem] w-full text-paper"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0 28 C180 8, 360 58, 540 32 C720 6, 900 62, 1080 30 C1200 12, 1320 48, 1440 26 V72 H0 Z"
        />
      </svg>
    </div>
  );
}
