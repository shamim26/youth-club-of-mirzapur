import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted text-white pt-12 md:pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pb-12 mb-8">
          <div className="text-center md:text-left max-w-sm">
            <Link href="/" className="inline-block mb-6">
              <span className="font-black text-3xl tracking-tighter bg-clip-text text-transparent bg-linear-to-br from-primary to-accent">
                YCM
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Serving the community by organizing local events, archiving our
              shared memories, and securely managing our collective funds.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/5 flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/5 flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-background/5 flex items-center justify-center transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
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
