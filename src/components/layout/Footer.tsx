import Link from "next/link";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
                JRW
              </div>
              <span className="text-lg font-bold text-white">
                JRW Engineering
              </span>
            </div>
            <p className="mb-2 text-sm leading-relaxed text-slate-400">
              Professional civil and structural engineering services in Phoenix,
              Arizona. Licensed PE providing reliable, responsive engineering
              solutions for commercial and residential projects.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <address className="flex flex-col gap-2 text-sm not-italic text-slate-400">
              <a
                href="tel:6026809831"
                className="transition-colors hover:text-white"
              >
                (602) 680-9831
              </a>
              <a
                href="mailto:jason@jrwengineering.us"
                className="transition-colors hover:text-white"
              >
                jason@jrwengineering.us
              </a>
            </address>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
          &copy; 2026 JRW Engineering. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
