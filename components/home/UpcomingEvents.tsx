import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";

export function UpcomingEvents() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Next Gathering
            </h2>
            <div className="h-1.5 w-20 bg-primary rounded-full mb-4" />
            <p className="text-muted-foreground">
              Don&apos;t miss our upcoming community events. Register early to
              help us with logistics and catering!
            </p>
          </div>
          <Link href="/events" className="hidden md:block">
            <Button variant="outline" className="rounded-full">
              View All Events
            </Button>
          </Link>
        </div>

        {/* Featured Event Card */}
        <div className="relative group overflow-hidden rounded-3xl bg-card border border-border/50 shadow-md transition-shadow hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image/Date Section */}
            <div className="relative lg:w-2/5 min-h-[300px] lg:min-h-auto bg-muted">
              {/* Image Placeholder Background */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/90 to-primary/40 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-background/95 backdrop-blur-md rounded-2xl p-4 text-center shadow-lg transform group-hover:-translate-y-1 transition-transform">
                    <span className="block text-primary font-bold text-sm uppercase tracking-wider">
                      MAR
                    </span>
                    <span className="block text-foreground font-black text-3xl">
                      30
                    </span>
                  </div>
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    Featured
                  </span>
                </div>
                <div className="mt-auto">
                  <h4 className="text-white/80 font-medium text-sm tracking-wider uppercase mb-2">
                    Sports & Rec
                  </h4>
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-card">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                Eid-ul-Fitr Cricket Tournament
              </h3>

              <div className="space-y-4 mb-10">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-5 h-5 mr-3 text-primary/70" />
                  <span>08:00 AM - 04:00 PM</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-5 h-5 mr-3 text-primary/70" />
                  <span>Mirzapur Central Ground</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-5 h-5 mr-3 text-primary/70" />
                  <span>Sunday, March 30th, 2026</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full px-8 shadow-md">
                  Register to Play
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-8"
                >
                  Contribute to Fund
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Link href="/events" className="mt-8 md:hidden flex justify-center">
          <Button variant="outline" className="rounded-full w-full">
            View All Events
          </Button>
        </Link>
      </div>
    </section>
  );
}
