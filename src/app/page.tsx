import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/marketing/Reveal";
import Slideshow, { type Slide } from "@/components/marketing/Slideshow";
import ContactForm from "@/components/marketing/ContactForm";

const services = [
  {
    num: "01",
    title: "Residential Structural Design",
    description:
      "Custom homes, additions, and complex remodels — framing, foundations, and lateral systems designed for the way Arizona builds.",
  },
  {
    num: "02",
    title: "Commercial & Mixed-Use Structures",
    description:
      "Steel, concrete, masonry, and wood structures for commercial, retail, and mixed-use buildings, coordinated with the full design team.",
  },
  {
    num: "03",
    title: "Structural Inspections & Assessments",
    description:
      "Existing-structure evaluations, distress investigations, and condition reports with clear, actionable findings.",
  },
  {
    num: "04",
    title: "Renovations & Additions",
    description:
      "Opening up walls, adding floors, or reworking load paths — engineered so new and existing work together safely.",
  },
  {
    num: "05",
    title: "Permit & Plan-Review Support",
    description:
      "Structural calculations, peer review, and jurisdiction responses to move your project through permitting without surprises.",
  },
];

const stats = [
  { k: "15", u: "+", l: "Years in practice" },
  { k: "5", u: "", l: "States licensed" },
  { k: "100", u: "%", l: "Engineer-led, every project" },
  { k: "P.E.", u: "", l: "Stamped & sealed" },
];

const slides: Slide[] = [
  {
    src: "/marketing/project-1-structural-support.jpg",
    meta: "Commercial · Structural Support",
    title: "Commercial Structural Support Design",
    caption: "Steel support framing\nfor industrial equipment",
  },
  {
    src: "/marketing/project-2-residential.jpg",
    meta: "Residential · Development",
    title: "1111 Missouri",
    caption: "Phoenix, AZ\nMulti-family residential",
  },
  {
    src: "/marketing/project-3-missouri.jpg",
    meta: "Residential · Development",
    title: "240 Missouri",
    caption: "Phoenix, AZ\nCantilevered canopies & masonry",
  },
  {
    src: "/marketing/project-4-icf.png",
    meta: "Residential · ICF Construction",
    title: "ICF Custom Home",
    caption: "Insulated concrete form walls\nfrom pour to structure",
  },
];

export default function HomePage() {
  return (
    <div className="font-body text-ink">
      <Header />
      <main className="flex-1">
        {/* Hero — centered, navy */}
        <section className="overflow-hidden bg-navy px-[clamp(20px,5vw,64px)] pb-[clamp(40px,5vw,80px)] pt-[clamp(56px,8vw,120px)] text-center text-paper">
          <div className="mx-auto max-w-[1240px]">
            <span className="inline-flex items-center gap-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-accent-soft">
              Structural Engineering · Phoenix, Arizona
            </span>
            <h1 className="mx-auto mb-[22px] mt-[26px] max-w-[16ch] font-display text-[clamp(40px,7vw,92px)] font-black leading-[0.98] tracking-[-0.025em] text-white">
              Technical Expertise.
              <br />
              <span className="text-accent-soft">Practical Solutions.</span>
            </h1>
            <p className="mx-auto mb-[34px] max-w-[54ch] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-[rgba(244,241,236,0.72)]">
              Partnering with architects, contractors, developers, and owners to
              deliver safe, efficient, and cost-effective structural solutions
              from planning through construction.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-7 font-label text-[12.5px] tracking-[0.04em] text-[rgba(244,241,236,0.6)]">
              <span>
                <b className="font-semibold text-white">15+ yrs</b> in practice
              </span>
              <span>
                <b className="font-semibold text-white">Licensed</b> AZ · NM · CA
                · OR · CO
              </span>
              <span>
                <b className="font-semibold text-white">Direct</b> engineer
                access
              </span>
            </div>
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="scroll-mt-[74px] bg-paper px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,128px)]"
        >
          <div className="mx-auto max-w-[1240px]">
            <Reveal className="mb-[clamp(40px,5vw,68px)] flex flex-col items-start justify-between gap-[30px] sm:flex-row sm:items-end sm:flex-wrap">
              <div>
                <span className="font-label text-[13px] uppercase tracking-[0.12em] text-steel-2">
                  01 / Services
                </span>
                <h2 className="mt-[18px] font-display text-[clamp(30px,4.4vw,52px)] font-extrabold tracking-[-0.02em]">
                  What JRW does
                </h2>
              </div>
              <p className="max-w-[54ch] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-steel">
                A focused structural practice — every project handled
                personally, from analysis through stamped construction documents.
              </p>
            </Reveal>

            <div className="border-t border-line">
              {services.map((service) => (
                <Reveal key={service.num}>
                  <Link
                    href="#contact"
                    className="group grid grid-cols-[54px_1fr] items-center gap-x-[18px] gap-y-2 border-b border-line px-2 py-[34px] transition-colors hover:bg-paper-2 md:grid-cols-[88px_1fr_minmax(280px,40%)] md:gap-6"
                  >
                    <span className="font-label text-sm font-semibold text-accent">
                      {service.num}
                    </span>
                    <h3 className="font-display text-[clamp(22px,2.4vw,30px)] font-bold tracking-[-0.01em]">
                      {service.title}
                    </h3>
                    <p className="col-start-2 max-w-[42ch] text-[15.5px] text-steel md:col-start-3 md:max-w-none">
                      {service.description}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="bg-navy text-paper">
          <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-x-6 gap-y-[30px] px-[clamp(20px,5vw,64px)] py-[clamp(48px,5vw,72px)] md:grid-cols-4 md:gap-9">
            {stats.map((stat) => (
              <Reveal key={stat.l}>
                <div className="font-display text-[clamp(40px,4.6vw,58px)] font-extrabold leading-none tracking-[-0.02em] text-white">
                  {stat.k}
                  {stat.u && <span className="text-accent-soft">{stat.u}</span>}
                </div>
                <div className="mt-3 font-label text-xs uppercase tracking-[0.12em] text-[rgba(234,238,243,0.6)]">
                  {stat.l}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section
          id="work"
          className="scroll-mt-[74px] bg-paper-2 px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,128px)]"
        >
          <div className="mx-auto max-w-[1240px]">
            <Reveal className="mb-[clamp(40px,5vw,68px)]">
              <span className="font-label text-[13px] uppercase tracking-[0.12em] text-steel-2">
                02 / Selected Work
              </span>
              <h2 className="mt-[18px] font-display text-[clamp(30px,4.4vw,52px)] font-extrabold tracking-[-0.02em]">
                Projects
              </h2>
            </Reveal>

            <Reveal>
              <Slideshow slides={slides} />
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="scroll-mt-[74px] bg-navy px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,128px)] text-paper"
        >
          <div className="mx-auto grid max-w-[600px] gap-9">
            <Reveal className="text-center">
              <span className="inline-flex items-center justify-center gap-3 font-label text-xs font-medium uppercase tracking-[0.22em] text-accent-soft before:inline-block before:h-[2px] before:w-[26px] before:bg-accent-soft">
                03 / Contact
              </span>
              <h2 className="mx-auto my-[22px] font-display text-[clamp(30px,4.4vw,52px)] font-extrabold tracking-[-0.02em] text-white">
                Let&apos;s talk about your project.
              </h2>
              <p className="mx-auto max-w-[54ch] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-[rgba(234,238,243,0.7)]">
                Send a few details about scope, location, and timeline.
                You&apos;ll hear back directly from Jason — usually within one
                business day.
              </p>
            </Reveal>
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
