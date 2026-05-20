import Link from "next/link";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="relative bg-slate-800 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-600 text-sm font-bold text-white">
            JRW
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              JRW Engineering
            </span>
            <span className="hidden text-xs text-slate-400 sm:block">
              Civil &amp; Structural Engineering
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile navigation */}
        <MobileNav />
      </div>
    </header>
  );
}
