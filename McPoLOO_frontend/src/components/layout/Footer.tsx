import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/utils/site-config";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-porcelain">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">Premium European Line. 5 yil rasmiy garantiya va Butun O&apos;zbekiston bo&apos;ylab yetkazib berish.</p>
        </div>
        <div>
          <h3 className="text-sm font-bold">Navigatsiya</h3>
          <div className="mt-4 grid gap-2 text-sm text-muted">
            <Link href="/catalog">Katalog</Link>
            <Link href="/catalog#contact">Kontaktlar</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold">Aloqa</h3>
          <p className="mt-4 text-sm leading-6 text-muted">Telefon: {siteConfig.phone}<br />Manzil: {siteConfig.address}<br />Ish vaqti: {siteConfig.workingHours}</p>
          {siteConfig.telegram && <Link className="mt-3 block text-sm font-bold text-ink" href={siteConfig.telegram} target="_blank">Telegram: @mcpolooo</Link>}
          {siteConfig.instagram && <Link className="mt-1 block text-sm font-bold text-ink" href={siteConfig.instagram}>Instagram</Link>}
        </div>
      </div>
    </footer>
  );
}
