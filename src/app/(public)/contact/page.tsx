import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";
import Reveal from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Contact — JRW Engineering | Phoenix, AZ Structural Engineering",
  description:
    "Get in touch with JRW Engineering for structural engineering services in Phoenix, Arizona. Call 602-680-9831 or email jason@jrwengineering.us.",
};

const states = ["AZ", "NM", "CA", "OR", "CO"];

export default function ContactPage() {
  return (
    <>
      {/* Page header */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1240px] px-[clamp(20px,5vw,64px)] pb-[clamp(40px,5vw,64px)] pt-[clamp(56px,7vw,104px)]">
          <span className="inline-flex items-center gap-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-accent-soft before:inline-block before:h-[2px] before:w-[26px] before:bg-accent-soft">
            Get in touch
          </span>
          <h1 className="my-[22px] max-w-[16ch] font-display text-[clamp(38px,5.6vw,68px)] font-extrabold leading-none tracking-[-0.025em] text-white">
            Let&apos;s talk about your <span className="text-accent-soft">project</span>.
          </h1>
          <p className="max-w-[56ch] text-[clamp(16px,1.4vw,20px)] leading-[1.6] text-paper/70">
            Whether you need a quote, a plan review, or a second set of eyes on a
            structural challenge, reach out and we will respond within one
            business day.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,104px)]">
        <div className="mx-auto grid max-w-[1240px] gap-[clamp(36px,5vw,72px)] md:grid-cols-[0.85fr_1.15fr]">
          {/* Contact details */}
          <Reveal>
            <div className="border-t-2 border-ink pt-5">
              <div className="mb-[18px] font-label text-xs uppercase tracking-[0.12em] text-steel">
                Direct contact
              </div>

              <div className="space-y-7">
                <div>
                  <div className="font-label text-[11px] uppercase tracking-[0.12em] text-steel-2">
                    Phone
                  </div>
                  <a
                    href="tel:+16026809831"
                    className="mt-1 inline-block font-display text-[clamp(20px,2.4vw,28px)] font-extrabold tracking-[-0.02em] text-ink transition-colors hover:text-accent"
                  >
                    602-680-9831
                  </a>
                </div>

                <div>
                  <div className="font-label text-[11px] uppercase tracking-[0.12em] text-steel-2">
                    Email
                  </div>
                  <a
                    href="mailto:jason@jrwengineering.us"
                    className="mt-1 inline-block font-display text-[clamp(18px,2vw,24px)] font-extrabold tracking-[-0.02em] text-ink transition-colors hover:text-accent"
                  >
                    jason@jrwengineering.us
                  </a>
                </div>

                <div>
                  <div className="font-label text-[11px] uppercase tracking-[0.12em] text-steel-2">
                    Based in
                  </div>
                  <p className="mt-1 text-[17px] leading-[1.6] text-ink">
                    Phoenix, Arizona
                  </p>
                </div>
              </div>

              {/* Business hours */}
              <div className="mt-9 rounded border border-line bg-paper p-6">
                <div className="mb-3 font-label text-xs uppercase tracking-[0.12em] text-steel">
                  Business hours
                </div>
                <dl className="space-y-1.5 text-[15px] leading-[1.6] text-ink">
                  <div className="flex justify-between gap-6">
                    <dt className="text-steel">Monday &ndash; Friday</dt>
                    <dd className="font-label text-steel-2">
                      8:00 AM &ndash; 5:00 PM MST
                    </dd>
                  </div>
                  <div className="flex justify-between gap-6">
                    <dt className="text-steel">Saturday &ndash; Sunday</dt>
                    <dd className="font-label text-steel-2">Closed</dd>
                  </div>
                </dl>
              </div>

              {/* Licensure */}
              <div className="mb-[14px] mt-9 font-label text-xs uppercase tracking-[0.12em] text-steel">
                Licensed in
              </div>
              <div className="flex flex-wrap gap-2">
                {states.map((state) => (
                  <span
                    key={state}
                    className="flex items-baseline gap-1.5 rounded border border-line bg-paper px-3.5 py-2"
                  >
                    <span className="font-display text-[15px] font-extrabold tracking-[-0.01em]">
                      {state}
                    </span>
                    <span className="font-label text-[10px] uppercase tracking-[0.08em] text-accent">
                      P.E.
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Inquiry form (navy panel) */}
          <Reveal>
            <div className="rounded-md bg-navy p-[clamp(24px,4vw,44px)]">
              <span className="inline-flex items-center gap-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-accent-soft before:inline-block before:h-[2px] before:w-[26px] before:bg-accent-soft">
                Request a quote
              </span>
              <h2 className="mb-7 mt-4 font-display text-[clamp(24px,3vw,34px)] font-extrabold tracking-[-0.02em] text-white">
                Tell us about the work.
              </h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
