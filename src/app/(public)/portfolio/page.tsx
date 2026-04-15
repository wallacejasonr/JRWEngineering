import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Work | JRW Engineering",
  description:
    "View selected projects from JRW Engineering, including commercial, residential, and municipal work.",
};

const projects = [
  {
    name: "Commercial Restaurant Build-Out",
    service: "Mechanical Support Design",
    location: "Buckeye, AZ",
    description:
      "Mechanical support design and structural calculations for a new restaurant build-out, including rooftop equipment supports and ductwork hangers.",
  },
  {
    name: "Residential Horse Barn & Shed",
    service: "Structural Calculations",
    location: "New River, AZ",
    description:
      "Complete structural calculations and sealed cover sheets for a residential horse barn and storage shed, including foundation design and wood framing analysis.",
  },
  {
    name: "Electrical Yard Canopy",
    service: "Canopy Design",
    location: "Phoenix, AZ",
    description:
      "Structural design for an electrical yard canopy including steel frame analysis, connection design, and foundation calculations to withstand Arizona wind loads.",
  },
  {
    name: "Municipal Drainage Improvement",
    service: "Civil Design",
    location: "Maricopa County, AZ",
    description:
      "Civil engineering design for a municipal drainage improvement project including hydrology analysis, channel design, and grading plans.",
  },
  {
    name: "Retail Tenant Improvement",
    service: "Structural Engineering",
    location: "Scottsdale, AZ",
    description:
      "Structural analysis and sealed calculations for interior renovations to an existing retail space, including load path verification and opening modifications.",
  },
  {
    name: "Warehouse Addition",
    service: "Structural & Civil Design",
    location: "Tempe, AZ",
    description:
      "Combined structural and civil engineering services for a warehouse addition including steel framing design, foundation engineering, and site grading.",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Our Work
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            A selection of projects showcasing our structural and civil
            engineering capabilities.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.name}
                className="overflow-hidden rounded-lg border border-slate-200 transition-shadow hover:shadow-lg"
              >
                {/* Image placeholder */}
                <div className="flex h-48 items-center justify-center bg-slate-100">
                  <svg
                    className="h-16 w-16 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                    />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium text-blue-700">
                      {project.service}
                    </span>
                  </div>
                  <h2 className="mb-1 text-lg font-semibold text-slate-900">
                    {project.name}
                  </h2>
                  <p className="mb-3 text-xs text-slate-500">
                    {project.location}
                  </p>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {project.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Have a project in mind?
          </h2>
          <p className="mt-3 text-slate-600">
            We would love to learn about your project and discuss how we can
            help.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start a Conversation
          </a>
        </div>
      </section>
    </>
  );
}
