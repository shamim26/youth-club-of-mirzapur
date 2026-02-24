import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://youthclubofmirzapur.vercel.app";

  // Base static routes
  const staticPages = [
    "",
    "/events",
    "/gallery",
    "/about",
    "/privacy",
    "/terms",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // We use the raw client here (bypassing cookies) so Next.js can evaluate this flawlessly
    // during build/static generation if needed.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    );

    // Fetch dynamically published events
    const { data: events } = await supabase
      .from("events")
      .select("id, created_at")
      .eq("is_published", true);

    const eventPages = (events || []).map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: event.created_at
        ? new Date(event.created_at).toISOString()
        : new Date().toISOString(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...eventPages];
  } catch (error) {
    console.error("Failed to fetch events for sitemap:", error);
    // Return at least the static pages if the dynamic fetch fails
    return staticPages;
  }
}
