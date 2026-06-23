"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export type Slide = {
  src: string;
  meta: string;
  title: string;
  caption: string;
};

const pad = (n: number) => (n < 10 ? "0" : "") + n;

export default function Slideshow({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 6500);
  }, [count]);

  const go = useCallback(
    (n: number) => {
      setIndex(((n % count) + count) % count);
      restartAuto();
    },
    [count, restartAuto],
  );

  useEffect(() => {
    restartAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartAuto]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-md bg-navy shadow-[0_30px_60px_-30px_rgba(20,34,60,0.5)]">
        <div
          className="flex transition-transform duration-[550ms] ease-[cubic-bezier(0.65,0.05,0.36,1)]"
          style={{ transform: `translateX(${-index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.title} className="relative min-w-full">
              <div className="relative h-[clamp(340px,52vw,620px)] w-full">
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1240px) 100vw, 1240px"
                  className="object-cover"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 bg-gradient-to-t from-[rgba(20,34,60,0.92)] to-transparent px-[clamp(24px,4vw,56px)] pb-8 pt-12 text-white">
                <div>
                  <div className="mb-3 font-label text-xs uppercase tracking-[0.14em] text-accent-soft">
                    {slide.meta}
                  </div>
                  <h3 className="font-display text-[clamp(24px,3vw,38px)] font-extrabold tracking-[-0.02em]">
                    {slide.title}
                  </h3>
                </div>
                <div className="whitespace-pre-line text-right font-label text-[13px] leading-[1.7] text-[rgba(234,238,243,0.78)]">
                  {slide.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-5">
        <div className="flex gap-2.5">
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-1 w-[34px] rounded-[2px] transition-colors ${
                i === index ? "bg-accent" : "bg-line"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-5">
          <span className="font-label text-[13px] tracking-[0.08em] text-steel">
            {pad(index + 1)} / {pad(count)}
          </span>
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(index - 1)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded border-[1.5px] border-ink bg-transparent text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(index + 1)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded border-[1.5px] border-ink bg-transparent text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
