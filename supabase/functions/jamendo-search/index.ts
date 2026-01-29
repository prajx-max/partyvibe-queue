import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Jamendo API client ID - this is a public API with free tier
const JAMENDO_CLIENT_ID = "b6747d04";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 20 } = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search Jamendo for tracks
    const searchUrl = new URL("https://api.jamendo.com/v3.0/tracks");
    searchUrl.searchParams.set("client_id", JAMENDO_CLIENT_ID);
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("limit", String(limit));
    searchUrl.searchParams.set("namesearch", query);
    searchUrl.searchParams.set("include", "musicinfo");
    searchUrl.searchParams.set("audioformat", "mp32");

    console.log("Searching Jamendo for:", query);

    const response = await fetch(searchUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Jamendo API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform to our format
    const tracks = data.results.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      duration: track.duration,
      audioUrl: track.audio, // MP3 stream URL
      imageUrl: track.image,
      albumName: track.album_name,
    }));

    return new Response(
      JSON.stringify({ tracks }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Jamendo search error:", error);
    const errorMessage = error instanceof Error ? error.message : "Search failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
