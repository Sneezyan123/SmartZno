"use client";

import { useEffect, useRef, useState } from "react";

const PHONE_DISPLAY = "+380 68 518 00 00";
const PHONE_HREF = "tel:+380685180000";
const TELEGRAM_HANDLE = "@smartZno";
const TELEGRAM_HREF = "https://t.me/smartZno";

export function ContactFab() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="contact-fab">
      {open && (
        <div className="contact-fab-panel" role="dialog" aria-label="Контакти SmartZno">
          <p className="text-[11px] font-bold tracking-[0.14em] text-teal-bright uppercase">
            Звʼязатися з нами
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            Відповімо в робочий час Europe/Kyiv
          </p>
          <a href={PHONE_HREF} className="contact-fab-row">
            <span className="contact-fab-ico" aria-hidden>
              <PhoneIcon />
            </span>
            <span>
              <span className="block text-[11px] text-white/45">Телефон</span>
              <span className="font-semibold tracking-wide text-white">{PHONE_DISPLAY}</span>
            </span>
          </a>
          <a href={TELEGRAM_HREF} target="_blank" rel="noreferrer" className="contact-fab-row">
            <span className="contact-fab-ico" aria-hidden>
              <TelegramIcon />
            </span>
            <span>
              <span className="block text-[11px] text-white/45">Telegram</span>
              <span className="font-semibold text-white">{TELEGRAM_HANDLE}</span>
            </span>
          </a>
        </div>
      )}

      <button
        type="button"
        className="contact-fab-btn"
        aria-expanded={open}
        aria-label={open ? "Закрити контакти" : "Відкрити контакти"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <CloseIcon /> : <PhoneIcon />}
      </button>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[22px] w-[22px]" aria-hidden>
      <path
        d="M7.4 3.6c.4-.4 1-.5 1.5-.3l2.2 1c.5.2.8.7.8 1.3v2.2c0 .4-.2.8-.5 1.1L10 10.2a12.4 12.4 0 0 0 3.8 3.8l1.3-1.4c.3-.3.7-.5 1.1-.5h2.2c.6 0 1.1.3 1.3.8l1 2.2c.2.5.1 1.1-.3 1.5l-1.3 1.3c-.4.4-1 .6-1.6.6C11.2 20.5 3.5 12.8 3.5 6.9c0-.6.2-1.2.6-1.6L7.4 3.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M21.5 4.4 18.3 20c-.2 1-1.4 1.4-2.2.8l-4.4-3.3-2.1 2c-.3.3-.8.1-.9-.3l-.4-4.7L3 12.3c-1-.3-1-1.7.1-2L20.3 3.7c.9-.3 1.7.5 1.2 1.7Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
