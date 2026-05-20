import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | JRW Engineering",
  description:
    "Get in touch with JRW Engineering for structural and civil engineering services in Phoenix, AZ.",
};

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Ready to discuss your project? Reach out and we will respond within
            one business day.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Get in Touch
              </h2>
              <p className="mb-8 text-base leading-relaxed text-slate-600">
                Whether you have a question about our services, need a quote for
                an upcoming project, or want to discuss a technical challenge, we
                are here to help.
              </p>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Phone
                    </h3>
                    <a
                      href="tel:6026809831"
                      className="mt-1 block text-sm text-slate-600 hover:text-blue-600"
                    >
                      (602) 680-9831
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Email
                    </h3>
                    <a
                      href="mailto:jason@jrwengineering.us"
                      className="mt-1 block text-sm text-slate-600 hover:text-blue-600"
                    >
                      jason@jrwengineering.us
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="mt-8 rounded-lg bg-slate-50 p-6">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  Business Hours
                </h3>
                <p className="text-sm text-slate-600">
                  Monday &ndash; Friday: 8:00 AM &ndash; 5:00 PM MST
                </p>
                <p className="text-sm text-slate-600">
                  Saturday &ndash; Sunday: Closed
                </p>
              </div>
            </div>

            {/* Email CTA */}
            <div>
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-10 text-center">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">
                  Email Us
                </h2>
                <p className="mb-8 max-w-sm text-base leading-relaxed text-slate-600">
                  Reach out by email and we will respond within one business
                  day.
                </p>
                <a
                  href="mailto:jason@jrwengineering.us"
                  className="inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Email jason@jrwengineering.us
                </a>
                <p className="mt-4 text-sm text-slate-500">
                  jason@jrwengineering.us
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
