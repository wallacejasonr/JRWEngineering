import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | JRW Engineering",
  description:
    "Learn about JRW Engineering, a Phoenix-based civil and structural engineering firm.",
};

const values = [
  {
    title: "Integrity",
    description:
      "Every calculation, every seal, every deliverable reflects our commitment to doing the job right. We stand behind our work because our clients depend on it.",
  },
  {
    title: "Precision",
    description:
      "Engineering is a discipline of exactness. We apply rigorous analysis and attention to detail to every project, no matter the size or complexity.",
  },
  {
    title: "Client Service",
    description:
      "We believe responsive communication and reliable turnaround times are just as important as technical excellence. Your project timelines matter to us.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            About JRW Engineering
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Professional engineering services built on experience, precision, and
            a commitment to client success.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">
              Our Story
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              <p>
                JRW Engineering was founded by Jason R. Wallace, PE, with a
                clear mission: to provide responsive, high-quality structural and
                civil engineering services to the Phoenix metropolitan area and
                beyond. Based in Phoenix, Arizona, we serve contractors,
                architects, developers, and property owners across the state.
              </p>
              <p>
                Our firm specializes in the practical side of engineering &mdash;
                delivering the calculations, sealed documents, and construction
                support that move projects from design to completion. Whether it
                is a commercial restaurant build-out, a residential addition, or
                a municipal infrastructure project, we bring the same level of
                professionalism and technical rigor to every engagement.
              </p>
              <p>
                We understand that our clients need more than just numbers on a
                page. They need an engineering partner who communicates clearly,
                meets deadlines, and provides solutions that are both
                code-compliant and constructable. That is the standard we hold
                ourselves to on every project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Our Values
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-lg bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">
              Credentials &amp; Licensing
            </h2>
            <p className="mb-8 text-base leading-relaxed text-slate-600">
              JRW Engineering maintains all required professional licensing and
              stays current with continuing education requirements to ensure our
              clients receive the highest standard of service.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-6">
                <p className="text-2xl font-bold text-blue-600">PE</p>
                <p className="mt-1 text-sm text-slate-600">
                  Licensed Professional Engineer
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-6">
                <p className="text-2xl font-bold text-blue-600">AZ</p>
                <p className="mt-1 text-sm text-slate-600">
                  State of Arizona Licensed
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-6">
                <p className="text-2xl font-bold text-blue-600">IBC</p>
                <p className="mt-1 text-sm text-slate-600">
                  International Building Code Compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
