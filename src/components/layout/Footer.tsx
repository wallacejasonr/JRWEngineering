import Link from "next/link";
import Image from "next/image";

const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Projects" },
  { href: "/about", label: "About" },
];

const states = ["AZ", "NM", "CA", "OR", "CO"];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper pb-10 pt-16 font-body text-ink">
      <div className="mx-auto max-w-[1240px] px-[clamp(20px,5vw,64px)]">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <Image
              src="/marketing/jrw-wordmark-knockout.png"
              alt="JRW Engineering"
              width={150}
              height={30}
              className="mb-[18px] h-[30px] w-auto"
            />
            <p className="max-w-[34ch] text-sm text-steel">
              Independent structural engineering for residential and commercial
              projects across the desert Southwest.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <h4 className="mb-3.5 font-label text-[11px] font-medium uppercase tracking-[0.14em] text-steel-2">
                Site
              </h4>
              {siteLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block py-[5px] text-[15px] transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div>
              <h4 className="mb-3.5 font-label text-[11px] font-medium uppercase tracking-[0.14em] text-steel-2">
                Contact
              </h4>
              <a
                href="mailto:jason@jrwengineering.us"
                className="block py-[5px] text-[15px] transition-colors hover:text-accent"
              >
                jason@jrwengineering.us
              </a>
              <a
                href="tel:+16026809831"
                className="block py-[5px] text-[15px] transition-colors hover:text-accent"
              >
                602-680-9831
              </a>
              <span className="block py-[5px] text-[15px]">Phoenix, Arizona</span>
            </div>

            <div>
              <h4 className="mb-3.5 font-label text-[11px] font-medium uppercase tracking-[0.14em] text-steel-2">
                Licensed In
              </h4>
              <div className="flex flex-wrap gap-2">
                {states.map((state) => (
                  <span
                    key={state}
                    className="rounded-full border border-line px-3 py-[5px] font-label text-[11px] tracking-[0.1em] text-steel"
                  >
                    <b className="font-semibold text-accent">{state}</b>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-5 border-t border-line pt-6 font-label text-xs tracking-[0.04em] text-steel-2">
          <span>© 2026 JRW Engineering · Jason R. Wallace, P.E.</span>
          <span>Structural Engineering · Phoenix, AZ</span>
        </div>
      </div>
    </footer>
  );
}
