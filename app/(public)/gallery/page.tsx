import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { EventPhoto } from "@/types/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Browse photos from our recent events and activities. See the wonderful memories created by the Youth Club of Mirzapur.",
  openGraph: {
    title: "Photo Gallery | Youth Club of Mirzapur",
    description:
      "Browse photos from our recent events and activities. See the wonderful memories created by the Youth Club of Mirzapur.",
    url: "/gallery",
  },
};

const placeholderImages = [
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=800&auto=format&fit=crop",
];

export default async function GalleryPage() {
  const supabase = await createClient();

  // Fetch verified event photos
  const { data: photos, error } = await supabase
    .from("event_photos")
    .select("*, event:events(title)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
  }

  // Use natural fetching first, fallback to beautiful placeholders to ensure it's not empty
  const displayPhotos =
    photos && photos.length > 5
      ? photos
      : [
          ...(photos || []),
          ...placeholderImages.map(
            (url, i) =>
              ({
                id: `placeholder-${i}`,
                url: url,
                event_id: "demo",
                caption: "Memories from our youth activities",
                uploaded_by: null,
                created_at: new Date().toISOString(),
                event: { title: "Community Event" },
              }) as unknown as EventPhoto & { event: { title: string } },
          ),
        ];

  // Split photos based on screen breakpoints to ensure no images are lost
  // 1-Column Breakpoint (Mobile)
  const mobilePhotos = displayPhotos;

  // 2-Column Breakpoint (Tablet)
  const tabletCol1 = displayPhotos.filter((_, i) => i % 2 === 0);
  const tabletCol2 = displayPhotos.filter((_, i) => i % 2 === 1);

  // 3-Column Breakpoint (Desktop)
  const desktopCol1 = displayPhotos.filter((_, i) => i % 3 === 0);
  const desktopCol2 = displayPhotos.filter((_, i) => i % 3 === 1);
  const desktopCol3 = displayPhotos.filter((_, i) => i % 3 === 2);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 overflow-hidden relative">
      {/* Background Gradients matching UI theme */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10 flex flex-col h-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground mb-4">
            Our{" "}
            <span className="bg-linear-to-br from-primary to-accent bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
        </div>

        {/* Gallery Window - Fixed height to allow infinite scrolling text */}
        <div className="relative w-full h-[80vh] md:h-[75vh] overflow-hidden rounded-2xl backdrop-blur-sm shadow-2xl group active:paused">
          {/* Fade overlay top and bottom to make the infinite scroll soft */}
          <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-background to-transparent z-20 pointer-events-none" />

          {/* 
              Responsive Masonry Animations
              We render different containers for Mobile, Tablet, and Desktop
              to ensure no photos are "hidden" when grid columns condense.
           */}

          {/* MOBILE (1 Column) */}
          <div className="grid grid-cols-1 gap-6 px-6 h-full relative z-10 md:hidden">
            <div className="flex flex-col gap-6 w-full relative group-hover:paused group-active:paused animate-infinite-scroll-y hover:paused active:paused">
              {[...mobilePhotos, ...mobilePhotos].map((photo, idx) => (
                <PhotoCard key={`mob-${photo.id}-${idx}`} photo={photo} />
              ))}
            </div>
          </div>

          {/* TABLET (2 Columns) */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 px-6 h-full relative z-10">
            <div className="flex flex-col gap-6 w-full relative group-hover:paused group-active:paused animate-infinite-scroll-y hover:paused active:paused">
              {[...tabletCol1, ...tabletCol1].map((photo, idx) => (
                <PhotoCard key={`tab1-${photo.id}-${idx}`} photo={photo} />
              ))}
            </div>
            <div
              className="flex flex-col gap-6 w-full relative group-hover:paused group-active:paused animate-infinite-scroll-y hover:paused active:paused"
              style={{ animationDelay: "-15s" }}
            >
              {[...tabletCol2, ...tabletCol2].map((photo, idx) => (
                <PhotoCard key={`tab2-${photo.id}-${idx}`} photo={photo} />
              ))}
            </div>
          </div>

          {/* DESKTOP (3 Columns) */}
          <div className="hidden lg:grid grid-cols-3 gap-6 px-6 h-full relative z-10">
            <div className="flex flex-col gap-6 w-full relative group-hover:paused group-active:paused animate-infinite-scroll-y hover:paused active:paused">
              {[...desktopCol1, ...desktopCol1].map((photo, idx) => (
                <PhotoCard key={`desk1-${photo.id}-${idx}`} photo={photo} />
              ))}
            </div>
            <div
              className="flex flex-col gap-6 w-full relative group-hover:paused group-active:paused animate-infinite-scroll-y hover:paused active:paused"
              style={{ animationDelay: "-15s" }}
            >
              {[...desktopCol2, ...desktopCol2].map((photo, idx) => (
                <PhotoCard key={`desk2-${photo.id}-${idx}`} photo={photo} />
              ))}
            </div>
            <div
              className="flex flex-col gap-6 w-full relative group-hover:paused group-active:paused animate-infinite-scroll-y hover:paused active:paused"
              style={{ animationDelay: "-7.5s" }}
            >
              {[...desktopCol3, ...desktopCol3].map((photo, idx) => (
                <PhotoCard key={`desk3-${photo.id}-${idx}`} photo={photo} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoCard({
  photo,
}: {
  photo: EventPhoto & { event?: { title: string } };
}) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-border/30 group hover:border-primary/50 transition-colors bg-muted/20">
      <div className="relative w-full aspect-4/5 sm:aspect-3/4 overflow-hidden">
        <Image
          src={photo.url}
          alt={photo.caption || "Event Photo"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Hover/Active Info Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 active:opacity-100">
          {photo.event?.title && (
            <h3 className="text-white font-bold text-lg leading-tight mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {photo.event.title}
            </h3>
          )}
          {photo.caption && (
            <p className="text-white/80 text-sm line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              {photo.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
