import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-white pt-12 md:pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pb-12 mb-8">
          <div className="flex flex-col items-center md:items-start max-w-sm space-y-4">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105 active:scale-95"
            >
              <Image
                src="/logo-y.png"
                alt="Youth Club of Mirzapur Logo"
                width={280}
                height={280}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-12 md:gap-24 text-center sm:text-left">
            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold text-white tracking-wider uppercase text-sm">
                Pages
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/events"
                  className="text-white/70 hover:text-primary transition-colors text-sm"
                >
                  Events
                </Link>
                <Link
                  href="/gallery"
                  className="text-white/70 hover:text-primary transition-colors text-sm"
                >
                  Gallery
                </Link>
                <Link
                  href="/about"
                  className="text-white/70 hover:text-primary transition-colors text-sm"
                >
                  About
                </Link>
              </nav>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="font-semibold text-white tracking-wider uppercase text-sm">
                Legal
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  href="/privacy"
                  className="text-white/70 hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-white/70 hover:text-primary transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-white/50 font-medium border-t border-accent/30 py-6">
        <p>
          © {new Date().getFullYear()} Youth Club of Mirzapur. Preserving our
          roots.
        </p>
      </div>
    </footer>
  );
}
