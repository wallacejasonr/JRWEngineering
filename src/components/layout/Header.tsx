"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-[12px] font-body">
      <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-[clamp(20px,5vw,64px)]">
        <Link href="/" className="flex h-[74px] items-center" aria-label="JRW Engineering home">
          <Image
            src="/marketing/jrw-wordmark-knockout.png"
            alt="JRW Engineering"
            width={170}
            height={34}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="text-ink md:hidden"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap rounded px-3.5 py-2.5 font-label text-[13px] uppercase tracking-[0.06em] transition-colors hover:text-ink ${
                isActive(link.href) ? "text-ink" : "text-steel"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="mt-[5px] block h-[2px] bg-accent" />
              )}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="whitespace-nowrap rounded bg-navy px-5 py-[11px] font-label text-[13px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent"
          >
            Request a Quote
          </Link>
        </nav>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-b border-line bg-paper px-[clamp(20px,5vw,64px)] pb-[22px] pt-3.5 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`w-full px-1 py-3 font-label text-[13px] uppercase tracking-[0.06em] transition-colors hover:text-ink ${
                isActive(link.href) ? "text-ink" : "text-steel"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded bg-navy px-5 py-3 text-center font-label text-[13px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-accent"
          >
            Request a Quote
          </Link>
        </nav>
      )}
    </header>
  );
}
