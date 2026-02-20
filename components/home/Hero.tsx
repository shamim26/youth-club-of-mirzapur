import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/Hero_image.jpg"
          alt="Youth Club of Mirzapur Community"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Dark/Gold Overlays for readability and theme blending */}
      <div className="absolute inset-0 bg-background/70 mix-blend-multiply -z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-transparent -z-10" />
      <div className="absolute inset-0 bg-primary/10 mix-blend-overlay backdrop-blur-xs -z-10" />

      {/* Centered Content Area */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:px-16 xl:px-24 text-center flex flex-col items-center pt-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center justify-center rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent ring-1 ring-inset ring-accent/30 mb-8 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our Digital Headquarters
          </div>

          <h1 className="text-5xl font-black tracking-tight text-foreground sm:text-6xl md:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both drop-shadow-xl">
            Welcome to the <br />
            <span className="text-primary bg-clip-text drop-shadow-[0_0_15px_rgba(45,93,47,0.5)]">
              Youth Club of Mirzapur
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground/90 leading-relaxed mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both drop-shadow-md">
            Archiving memories, and building our community together. Join us in
            preserving our roots while building for the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500 fill-mode-both">
            <Link href="/events">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-full font-semibold text-base shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
              >
                View Upcoming Events
              </Button>
            </Link>
            <Link href="/join">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-full font-semibold text-base border-2 bg-background/20 backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground hover:border-transparent"
              >
                Join the Club
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
