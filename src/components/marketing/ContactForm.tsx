"use client";

import { useState, type FormEvent } from "react";

const fieldClass =
  "w-full rounded border border-white/[0.14] bg-white/[0.05] px-[15px] py-[13px] font-body text-[15px] text-white transition-colors placeholder:text-white/30 focus:border-accent-soft focus:bg-white/[0.08] focus:outline-none";

const labelClass =
  "mb-2 block font-label text-[11px] uppercase tracking-[0.12em] text-white/55";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const type = String(data.get("type") ?? "");
    const location = String(data.get("location") ?? "");
    const details = String(data.get("details") ?? "");

    const subject = `Project inquiry${type ? ` — ${type}` : ""}`;
    const body = `Name: ${name}\nEmail: ${email}\nProject type: ${type}\nLocation: ${location}\n\n${details}`;
    window.location.href = `mailto:jason@jrwengineering.us?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 2600);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="f-name">
            Name
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="f-email">
            Email
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className={fieldClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass} htmlFor="f-type">
          Project type
        </label>
        <input
          id="f-type"
          name="type"
          type="text"
          placeholder="Residential, commercial, inspection…"
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="f-loc">
          Location
        </label>
        <input
          id="f-loc"
          name="location"
          type="text"
          placeholder="City, state"
          className={fieldClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="f-msg">
          Project details
        </label>
        <textarea
          id="f-msg"
          name="details"
          placeholder="Scope, timeline, and anything else worth knowing."
          className={`${fieldClass} min-h-[120px] resize-y`}
        />
      </div>
      <button
        type="submit"
        className={`flex w-full items-center justify-center gap-2.5 rounded border-[1.5px] border-transparent px-[26px] py-[15px] font-label text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors ${
          sent ? "bg-navy" : "bg-accent hover:bg-navy"
        }`}
      >
        {sent ? (
          "Thanks — I’ll be in touch ✓"
        ) : (
          <>
            Send inquiry <span aria-hidden="true">→</span>
          </>
        )}
      </button>
    </form>
  );
}
