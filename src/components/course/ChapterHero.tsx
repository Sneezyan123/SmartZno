"use client";

import { useState } from "react";

export type ChapterHeroData = {
  title: string;
  label: string;
  era?: string;
  image?: string;
  atmosphere?: string;
  years?: string;
};

const YEARS: Record<string, string> = {
  Палеоліт: "бл. 1 млн – 11 тис. до н. е.",
  Мезоліт: "10–7 тис. до н. е.",
  Неоліт: "6–4 тис. до н. е.",
  "Енеоліт і Трипілля": "4–3 тис. до н. е.",
  "Залізний вік": "I тис. до н. е.",
  Кіммерійці: "IX–VII ст. до н. е.",
  Скіфи: "VII–III ст. до н. е.",
  "Грецькі поліси": "з VII ст. до н. е.",
  Сармати: "III ст. до н. е. - III ст. н. е.",
  "Слов’яни": "V–VII ст.",
};

function ChapterStill({ kind }: { kind: string }) {
  const key = kind.toLowerCase();
  if (key.includes("неоліт")) return <StillNeolithic />;
  if (key.includes("палеоліт")) return <StillPaleolithic />;
  if (key.includes("мезоліт")) return <StillMesolithic />;
  if (key.includes("трипілл") || key.includes("енеоліт")) return <StillTrypillia />;
  if (key.includes("кіммер") || key.includes("залізн")) return <StillSteppe />;
  if (key.includes("скіф")) return <StillScythian />;
  if (key.includes("поліс") || key.includes("грец")) return <StillGreek />;
  if (key.includes("сармат")) return <StillSarmatian />;
  if (key.includes("слов")) return <StillSlavic />;
  if (key.includes("стріч") || key.includes("час")) return <StillTimeline />;
  return <StillStudy />;
}

function StillNeolithic() {
  const stalks = Array.from({ length: 36 }, (_, i) => {
    const col = i % 12;
    const row = Math.floor(i / 12);
    const x = 80 + col * 128 + row * 28;
    const base = 620 + row * 70;
    const h = 140 + ((i * 17) % 50);
    return { x, base, h, i };
  });
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="neo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1208" />
          <stop offset="38%" stopColor="#c45c28" />
          <stop offset="62%" stopColor="#f0c36a" />
          <stop offset="100%" stopColor="#7a9a3a" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#neo-sky)" />
      <circle cx="1180" cy="220" r="90" fill="#ffe566" opacity="0.95" />
      <circle cx="1180" cy="220" r="160" fill="#ffe566" opacity="0.18" />
      <ellipse cx="320" cy="520" rx="280" ry="70" fill="#4a6a22" />
      <ellipse cx="900" cy="500" rx="420" ry="80" fill="#3f5c1c" />
      <rect x="180" y="430" width="90" height="70" rx="4" fill="#6a3e24" />
      <polygon points="170,430 225,380 280,430" fill="#4a2814" />
      <rect x="430" y="410" width="110" height="85" rx="4" fill="#7a4a28" />
      <polygon points="420,410 485,350 550,410" fill="#5a3018" />
      <rect x="720" y="440" width="80" height="60" rx="4" fill="#6a3e24" />
      <polygon points="710,440 760,395 810,440" fill="#4a2814" />
      {stalks.map((s) => (
        <g key={s.i}>
          <line x1={s.x} y1={s.base} x2={s.x} y2={s.base - s.h} stroke="#c4a035" strokeWidth="3" />
          <ellipse cx={s.x} cy={s.base - s.h} rx="7" ry="16" fill="#f5c518" />
        </g>
      ))}
      <path d="M80 820 C 200 760, 400 780, 560 800" fill="none" stroke="#2f4218" strokeWidth="8" opacity="0.35" />
    </svg>
  );
}

function StillPaleolithic() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#0b0614" />
      {[...Array(28)].map((_, i) => (
        <circle key={i} cx={(i * 137) % 1600} cy={40 + ((i * 73) % 280)} r={i % 4 === 0 ? 2.2 : 1.1} fill="#fff4c4" opacity="0.7" />
      ))}
      <path d="M-20 900 L-20 420 Q 280 180 520 380 T 980 300 T 1620 480 L 1620 900 Z" fill="#1a1210" />
      <ellipse cx="640" cy="520" rx="220" ry="160" fill="#3d2e24" />
      <ellipse cx="640" cy="520" rx="150" ry="110" fill="#120c10" />
      <circle cx="640" cy="560" r="70" fill="#f5c518" />
      <circle cx="640" cy="560" r="140" fill="#c45c28" opacity="0.35" />
      <circle cx="640" cy="560" r="240" fill="#c45c28" opacity="0.12" />
      <path d="M200 760 L 280 620 L 340 760 Z" fill="#1a0e08" />
      <path d="M980 780 L 1080 600 L 1180 780 Z" fill="#120a08" />
    </svg>
  );
}

function StillMesolithic() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="meso-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8d4" />
          <stop offset="55%" stopColor="#cfe8e4" />
          <stop offset="100%" stopColor="#1d6b66" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#meso-sky)" />
      <circle cx="1280" cy="160" r="70" fill="#fff4c4" />
      <path d="M0 520 C 280 460, 520 580, 820 500 S 1280 460, 1600 540 L 1600 900 L 0 900 Z" fill="#134845" />
      <path d="M0 560 C 300 500, 560 620, 900 540 S 1300 500, 1600 580 L 1600 900 L 0 900 Z" fill="#1d6b66" opacity="0.85" />
      <rect x="180" y="300" width="18" height="240" fill="#2a2038" />
      <polygon points="198,300 198,430 310,360" fill="#3f6b4a" />
      <rect x="380" y="260" width="22" height="280" fill="#1f3d28" />
      <polygon points="402,260 402,430 540,340" fill="#3f6b4a" />
      <ellipse cx="720" cy="620" rx="90" ry="22" fill="#2a241c" />
      <path d="M640 610 Q 720 580 800 610" fill="none" stroke="#1a1612" strokeWidth="6" />
    </svg>
  );
}

function StillTrypillia() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#6a2e12" />
      <rect width="1600" height="420" fill="#c45c28" />
      <circle cx="200" cy="180" r="90" fill="#faece4" opacity="0.2" />
      <path d="M120 180 C 160 80, 240 80, 280 180 S 200 280, 120 180" fill="none" stroke="#f6edd8" strokeWidth="10" />
      <path d="M1360 220 C 1420 80, 1540 80, 1560 240" fill="none" stroke="#f6edd8" strokeWidth="8" opacity="0.5" />
      <rect x="260" y="430" width="220" height="160" fill="#faece4" />
      <rect x="270" y="450" width="200" height="20" fill="#c45c28" />
      <rect x="270" y="490" width="200" height="20" fill="#c45c28" />
      <polygon points="250,430 370,340 490,430" fill="#8b3a18" />
      <rect x="620" y="400" width="260" height="190" fill="#faece4" />
      <rect x="635" y="430" width="230" height="18" fill="#c45c28" />
      <rect x="635" y="470" width="230" height="18" fill="#c45c28" />
      <polygon points="610,400 750,300 890,400" fill="#8b3a18" />
      <ellipse cx="420" cy="720" rx="70" ry="90" fill="#f6edd8" />
      <path d="M370 720 C 400 640, 440 640, 470 720" fill="none" stroke="#c45c28" strokeWidth="6" />
      <ellipse cx="860" cy="740" rx="90" ry="110" fill="#f6edd8" />
      <path d="M800 740 C 840 620, 880 620, 920 740" fill="none" stroke="#c45c28" strokeWidth="7" />
    </svg>
  );
}

function StillSteppe() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="iron-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1220" />
          <stop offset="50%" stopColor="#4a2020" />
          <stop offset="100%" stopColor="#7a3e3e" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#iron-sky)" />
      <ellipse cx="280" cy="620" rx="180" ry="70" fill="#2a1818" />
      <ellipse cx="700" cy="600" rx="220" ry="80" fill="#1a1010" />
      <ellipse cx="1180" cy="640" rx="200" ry="70" fill="#2a1818" />
      <path d="M900 640 L 930 420 L 960 640 Z" fill="#c4a035" />
      <path d="M400 700 Q 520 560 680 640 Q 620 700 400 700" fill="#1a0e0e" />
    </svg>
  );
}

function StillScythian() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#120c08" />
      <circle cx="800" cy="420" r="260" fill="#c4a035" opacity="0.2" />
      <circle cx="800" cy="420" r="160" fill="#f5c518" opacity="0.35" />
      <path d="M560 480 Q 800 220 1040 480 Q 800 560 560 480" fill="#c4a035" />
      <path d="M620 430 Q 800 300 980 430" fill="none" stroke="#fff4c4" strokeWidth="6" />
      <ellipse cx="800" cy="760" rx="340" ry="90" fill="#1a1208" />
    </svg>
  );
}

function StillGreek() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="sea-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d7a8" />
          <stop offset="42%" stopColor="#7eb8d4" />
          <stop offset="100%" stopColor="#163c52" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#sea-sky)" />
      <circle cx="240" cy="180" r="80" fill="#fff4c4" />
      <path d="M0 520 C 200 500, 400 560, 600 520 S 1000 500, 1600 560 L 1600 900 L 0 900 Z" fill="#2a6a8f" />
      <rect x="980" y="360" width="28" height="160" fill="#f6edd8" />
      <rect x="1040" y="340" width="28" height="180" fill="#f6edd8" />
      <rect x="1100" y="350" width="28" height="170" fill="#f6edd8" />
      <rect x="970" y="340" width="170" height="22" fill="#e6d2b0" />
      <path d="M200 620 L 280 560 L 420 590 L 520 550 L 640 600" fill="none" stroke="#e6f2f8" strokeWidth="4" opacity="0.5" />
    </svg>
  );
}

function StillSarmatian() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#4a2432" />
      <rect width="1600" height="480" fill="#8b5a6b" />
      <circle cx="1300" cy="140" r="70" fill="#f6eaee" opacity="0.8" />
      <path d="M0 620 L 1600 560 L 1600 900 L 0 900 Z" fill="#2a1218" />
      <path d="M240 640 Q 360 500 520 620 Q 400 700 240 640" fill="#1a0c10" />
      <path d="M620 600 Q 760 440 940 580 Q 800 680 620 600" fill="#1a0c10" />
      <path d="M1080 580 Q 1220 430 1400 560 Q 1260 660 1080 580" fill="#12080c" />
    </svg>
  );
}

function StillSlavic() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#1f3d28" />
      <rect width="1600" height="500" fill="#3f6b4a" />
      <ellipse cx="800" cy="200" rx="420" ry="80" fill="#e8f1ea" opacity="0.25" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i}>
          <rect x={80 + i * 220} y="240" width="22" height="420" fill="#1a2818" />
          <ellipse cx={91 + i * 220} cy="260" rx="70" ry="160" fill="#2f4a32" />
        </g>
      ))}
      <rect x="700" y="520" width="120" height="90" fill="#3d2e24" />
      <polygon points="690,520 760,460 830,520" fill="#2a1c14" />
      <circle cx="800" cy="640" r="28" fill="#f5c518" />
      <circle cx="800" cy="640" r="70" fill="#c45c28" opacity="0.35" />
    </svg>
  );
}

function StillTimeline() {
  const layers = [
    { y: 180, h: 120, c: "#6b5344" },
    { y: 300, h: 110, c: "#1d6b66" },
    { y: 410, h: 110, c: "#5a7a32" },
    { y: 520, h: 100, c: "#c45c28" },
    { y: 620, h: 100, c: "#a67c2d" },
    { y: 720, h: 180, c: "#7a3e3e" },
  ];
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#1a1208" />
      {layers.map((l, i) => (
        <rect key={i} x="0" y={l.y} width="1600" height={l.h} fill={l.c} opacity={0.9 - i * 0.04} />
      ))}
      <rect x="0" y="0" width="1600" height="180" fill="#2a2038" />
    </svg>
  );
}

function StillStudy() {
  return (
    <svg viewBox="0 0 1600 900" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="1600" height="900" fill="#120c18" />
      <ellipse cx="800" cy="420" rx="320" ry="220" fill="#2a2038" />
      <circle cx="800" cy="360" r="50" fill="#f5c518" />
      <circle cx="800" cy="360" r="140" fill="#f5c518" opacity="0.18" />
      <rect x="520" y="500" width="560" height="14" fill="#c4a035" opacity="0.5" />
      <rect x="560" y="540" width="200" height="120" fill="#f6edd8" opacity="0.35" />
      <rect x="840" y="560" width="180" height="90" fill="#f6edd8" opacity="0.25" />
    </svg>
  );
}

export function ChapterHero({ chapter }: { chapter: ChapterHeroData }) {
  const [photoOk, setPhotoOk] = useState(true);
  const years = chapter.years || YEARS[chapter.title];
  const showPhoto = Boolean(chapter.image && photoOk);

  return (
    <figure className="chapter-hero relative isolate -mx-1 overflow-hidden rounded-[var(--radius)] shadow-[0_28px_70px_rgba(8,6,16,0.38)] md:-mx-2">
      <div className="relative min-h-[300px] md:min-h-[430px]">
        <div className="chapter-hero-still absolute inset-0">
          <ChapterStill kind={chapter.label || chapter.title} />
        </div>
        {showPhoto ? (
          <img
            src={chapter.image}
            alt=""
            className="chapter-hero-still absolute inset-0 h-full w-full object-cover"
            onError={() => setPhotoOk(false)}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.4)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />
        <figcaption className="chapter-hero-copy relative flex min-h-[300px] flex-col justify-end px-5 py-6 md:min-h-[430px] md:px-8 md:py-9">
          {years ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">{years}</p>
          ) : (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber">{chapter.label}</p>
          )}
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.05] text-white md:text-6xl">
            {chapter.title}
          </h2>
          <div className="animate-bar mt-4 h-1 w-24 rounded-full bg-amber" />
          {chapter.atmosphere ? (
            <p className="mt-4 max-w-xl text-lg leading-8 text-white/90 md:text-xl">{chapter.atmosphere}</p>
          ) : null}
        </figcaption>
      </div>
    </figure>
  );
}
