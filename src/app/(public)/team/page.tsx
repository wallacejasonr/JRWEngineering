import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | JRW Engineering",
  description:
    "Meet the team at JRW Engineering, led by Jason R. Wallace, PE.",
};

const teamMembers = [
  {
    name: "Jason R. Wallace, PE",
    title: "Principal Engineer",
    initials: "JW",
    bio: "Jason founded JRW Engineering with over a decade of experience in structural and civil engineering. As a licensed Professional Engineer in the State of Arizona, he oversees all project deliverables and ensures every calculation and sealed document meets the highest standards of accuracy and code compliance.",
  },
  {
    name: "Maria Chen",
    title: "Project Engineer",
    initials: "MC",
    bio: "Maria brings strong analytical skills and attention to detail to every project. She specializes in structural calculations for commercial build-outs and coordinates closely with contractors to resolve technical questions during construction.",
  },
  {
    name: "David Torres",
    title: "Civil Designer",
    initials: "DT",
    bio: "David handles civil site design work including grading plans, drainage analysis, and utility coordination. His experience with Arizona soil conditions and local permitting requirements helps streamline the design process for our clients.",
  },
  {
    name: "Sarah Mitchell",
    title: "Project Coordinator",
    initials: "SM",
    bio: "Sarah manages project timelines, client communications, and document delivery. She ensures every project stays on schedule and that our clients always know where things stand.",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Our Team
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Experienced professionals dedicated to delivering quality
            engineering solutions.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="rounded-lg border border-slate-200 p-6 text-center transition-shadow hover:shadow-md"
              >
                {/* Avatar placeholder */}
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-200">
                  <span className="text-2xl font-bold text-slate-500">
                    {member.initials}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {member.name}
                </h2>
                <p className="mb-3 text-sm font-medium text-blue-600">
                  {member.title}
                </p>
                <p className="text-sm leading-relaxed text-slate-600">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Work With Our Team
          </h2>
          <p className="mt-3 text-slate-600">
            Have a project that needs engineering support? We would love to hear
            from you.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
