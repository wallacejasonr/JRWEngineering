import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "About — Jason R. Wallace, P.E. | JRW Engineering",
  description:
    "Jason R. Wallace, P.E., is the founder of JRW Engineering, a Phoenix-based structural engineering practice serving residential and commercial projects across the desert Southwest.",
};

const profile = [
  "Residential structural design",
  "Commercial & mixed-use",
  "Inspections & assessments",
  "Renovations & additions",
  "Permit & plan review",
];

const creds = ["Arizona", "New Mexico", "California", "Oregon", "Colorado"];

export default function AboutPage() {
  return (
    <>
      {/* About hero */}
      <section className="px-[clamp(20px,5vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(56px,7vw,110px)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(36px,5vw,72px)] md:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <span className="inline-flex items-center gap-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-accent before:inline-block before:h-[2px] before:w-[26px] before:bg-accent">
              About the engineer
            </span>
            <h1 className="my-[26px] font-display text-[clamp(38px,5.6vw,72px)] font-extrabold leading-none tracking-[-0.025em]">
              Jason R.
              <br />
              Wallace, <span className="text-accent">P.E.</span>
            </h1>
            <p className="mb-[26px] font-label text-sm uppercase tracking-[0.1em] text-steel">
              Principal Structural Engineer · JRW Engineering
            </p>
            <p className="max-w-[54ch] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-steel">
              A one-person structural practice built on a simple idea: the
              engineer who runs the calculations should be the same person who
              answers your call, walks your site, and stamps your drawings.
            </p>
          </Reveal>

          <Reveal className="relative">
            <div className="relative h-[clamp(380px,46vw,540px)] w-full overflow-hidden rounded-md">
              <Image
                src="/marketing/portrait.webp"
                alt="Jason R. Wallace, P.E."
                fill
                sizes="(max-width: 860px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* About body */}
      <section className="px-[clamp(20px,5vw,64px)] py-[clamp(56px,7vw,104px)]">
        <div className="mx-auto grid max-w-[1240px] gap-[clamp(36px,6vw,90px)] md:grid-cols-[0.7fr_1.3fr]">
          <Reveal className="self-start border-t-2 border-ink pt-5">
            <div className="mb-[18px] font-label text-xs uppercase tracking-[0.12em] text-steel">
              Profile
            </div>
            <p className="font-label text-[13.5px] leading-[1.9] text-steel">
              {profile.map((item, i) => (
                <span key={item}>
                  {item}
                  {i < profile.length - 1 && <br />}
                </span>
              ))}
            </p>
            <div className="mb-[18px] mt-[34px] font-label text-xs uppercase tracking-[0.12em] text-steel">
              Education
            </div>
            <p className="font-label text-[13.5px] leading-[1.8] text-steel">
              B.S. Civil Engineering
              <br />
              <span className="text-steel-2">New Mexico State University</span>
            </p>
          </Reveal>

          <Reveal>
            <h2 className="mb-6 font-display text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-0.02em]">
              Engineering you can put your name next to.
            </h2>
            <p className="mb-[1.3em] max-w-[62ch] text-[17px] leading-[1.7] text-ink">
              <span className="font-semibold text-accent">
                Jason R. Wallace, P.E.
              </span>{" "}
              is the founder of JRW Engineering, a Phoenix-based engineering firm
              focused on connecting design teams and contractors through
              practical, construction-driven engineering solutions.
            </p>
            <p className="mb-[1.3em] max-w-[62ch] text-[17px] leading-[1.7] text-ink">
              With experience spanning structural design, BIM coordination,
              delegated engineering, and over a decade of construction
              management, Jason helps transform engineering concepts into
              buildable, efficient, and successful projects.
            </p>
            <p className="mb-[1.3em] max-w-[62ch] text-[17px] leading-[1.7] text-ink">
              JRW Engineering specializes in providing responsive engineering
              support that bridges the gap between the office and the jobsite.
            </p>

            <div className="mb-[18px] mt-[46px] font-label text-xs uppercase tracking-[0.12em] text-steel">
              Licensure
            </div>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {creds.map((state) => (
                <div
                  key={state}
                  className="flex items-baseline gap-[9px] rounded border border-line bg-paper px-5 py-3"
                >
                  <span className="font-display text-[17px] font-extrabold tracking-[-0.01em]">
                    {state}
                  </span>
                  <span className="font-label text-xs uppercase tracking-[0.08em] text-accent">
                    P.E.
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-navy text-paper">
        <div className="mx-auto max-w-[1240px] px-[clamp(20px,5vw,64px)] py-[clamp(48px,5vw,72px)] text-center">
          <span className="inline-flex items-center justify-center gap-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-accent-soft before:inline-block before:h-[2px] before:w-[26px] before:bg-accent-soft after:inline-block after:h-[2px] after:w-[26px] after:bg-accent-soft">
            Let&apos;s build something solid
          </span>
          <h2 className="mx-auto mb-7 mt-5 max-w-[18ch] font-display text-[clamp(30px,4.4vw,52px)] font-extrabold tracking-[-0.02em] text-white">
            Have a project in mind?
          </h2>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-2.5 rounded border-[1.5px] border-white px-[26px] py-[15px] font-label text-[13px] font-medium uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-navy"
          >
            Get in touch{" "}
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
