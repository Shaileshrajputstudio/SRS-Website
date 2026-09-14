import Image from "next/image";
import Link from "next/link";
import { studio } from "@/lib/studio";
import { getStudioContactInfo } from "@/data/studioInfo";
import {
  PhoneIcon,
  WhatsAppIcon,
  EmailIcon,
  InstagramIconFilled,
  FacebookIconFilled,
} from "@/components/ConnectIcons";

// A thin underline that fades in on hover (via decoration color, not
// visibility) rather than an instant color swap alone — the same "grows
// in" spirit as the desktop nav's underline, adapted for a dense list of
// small text links where an animated width/scale per item would be
// visually noisy.
const linkUnderline =
  "underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current";
// Same treatment for a <span> nested inside an icon+text link — the span
// itself is never the hovered element, so it reacts to the parent
// anchor's hover (via Tailwind's `group`) instead of its own.
const nestedLinkUnderline =
  "underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-current";

export async function Footer() {
  const studioInfo = await getStudioContactInfo();

  return (
    <footer className="bg-[var(--footer-bg)]">
      <div className="mx-auto max-w-[1800px] px-6 sm:px-10 lg:px-16 pt-[104px] pb-[80px]">
        <div className="mb-16 grid grid-cols-1 gap-10 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Image
              src="/brand/srs-logo.png"
              alt={studio.name}
              width={1488}
              height={366}
              unoptimized
              className="mb-4 h-[37px] w-auto"
            />
            <p className="font-sans-ui max-w-xs text-sm text-[var(--ink)]/60">
              An evolving practice of life and design, objects and experiences
              inspired by the intelligence of nature.
            </p>
          </div>

          <div className="font-sans-ui text-sm">
            <p className="mb-3 tracking-[0.15em] text-[var(--ash)] uppercase">Explore</p>
            <ul className="space-y-4 text-[var(--ink)]/70">
              <li><Link href="/products" className={`hover:text-[var(--ink)] ${linkUnderline}`}>Products</Link></li>
              <li><Link href="/collections" className={`hover:text-[var(--ink)] ${linkUnderline}`}>Stories</Link></li>
              <li><Link href="/world" className={`hover:text-[var(--ink)] ${linkUnderline}`}>The Studio</Link></li>
              <li><Link href="/sadhana" className={`hover:text-[var(--ink)] ${linkUnderline}`}>Sadhana</Link></li>
              <li><Link href="/films" className={`hover:text-[var(--ink)] ${linkUnderline}`}>Films</Link></li>
              <li><Link href="/press" className={`hover:text-[var(--ink)] ${linkUnderline}`}>Exhibitions &amp; Press</Link></li>
              <li><Link href="/contact" className={`hover:text-[var(--ink)] ${linkUnderline}`}>Contact</Link></li>
            </ul>
          </div>

          <div className="font-sans-ui text-sm">
            <p className="mb-3 tracking-[0.15em] text-[var(--ash)] uppercase">Contact</p>
            <ul className="mb-8 space-y-2 text-[var(--ink)]/70">
              <li>
                <a href={`tel:${studioInfo.phone}`} className="group flex items-center gap-2 hover:text-[var(--ink)]">
                  <PhoneIcon className="h-4 w-4 shrink-0" />
                  <span className={nestedLinkUnderline}>Call</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${studioInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-[var(--ink)]"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span className={nestedLinkUnderline}>WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${studioInfo.email}`} className="group flex items-center gap-2 hover:text-[var(--ink)]">
                  <EmailIcon className="h-4 w-4 shrink-0" />
                  <span className={nestedLinkUnderline}>Email</span>
                </a>
              </li>
            </ul>

            <p className="mb-3 tracking-[0.15em] text-[var(--ash)] uppercase">Follow</p>
            <div className="flex items-center gap-3">
              <a
                href={studioInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                className="text-[var(--ink)] transition hover:opacity-70"
              >
                <InstagramIconFilled className="h-9 w-9" />
              </a>
              <a
                href={studioInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                className="text-[var(--ink)] transition hover:opacity-70"
              >
                <FacebookIconFilled className="h-9 w-9" />
              </a>
            </div>
          </div>
        </div>

        <div className="font-sans-ui flex flex-col gap-2 text-xs text-[var(--ink)]/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {studio.name}.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className={`hover:text-[var(--ink)] ${linkUnderline}`}>
              Privacy Policy
            </Link>
            <Link href="/terms" className={`hover:text-[var(--ink)] ${linkUnderline}`}>
              Terms of Use
            </Link>
            <a
              href="https://www.hueness.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-[var(--ink)] ${linkUnderline}`}
            >
              Made by Hueness
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
