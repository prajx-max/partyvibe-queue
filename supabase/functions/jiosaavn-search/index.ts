import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// JioSaavn unofficial API endpoints - trying multiple for reliability
const JIOSAAVN_APIS = [
  "https://saavn.sumit.co/api",
  "https://jiosaavn-api-ts.vercel.app/api",
];

async function fetchWithFallback(query: string, limit: number): Promise<any> {
  for (const baseUrl of JIOSAAVN_APIS) {
    try {
      const searchUrl = `${baseUrl}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}`;
      console.log(`Trying JioSaavn API: ${baseUrl}`);
      
      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PartyVoteDJ/1.0)",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success || data.data) {
          console.log(`Success with ${baseUrl}`);
          return data;
        }
      }
    } catch (error) {
      console.log(`Failed with ${baseUrl}:`, error);
      continue;
    }
  }
  throw new Error("All JioSaavn API endpoints failed");
}

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

    console.log("Searching JioSaavn for:", query);

    const data = await fetchWithFallback(query, limit);

    // Transform to our format - handle both API response formats
    const results = data.data?.results || data.results || [];
    
    const tracks = results.map((song: any) => {
      // Get the best quality image (500x500)
      const image = song.image?.find((img: any) => img.quality === "500x500") || 
                   song.image?.[song.image?.length - 1] || 
                   { url: song.image };
      
      // Get the best quality audio (320kbps preferred, then 160kbps, then 96kbps)
      const downloadUrls = song.downloadUrl || [];
      const audioUrl = 
        downloadUrls.find((d: any) => d.quality === "320kbps")?.url ||
        downloadUrls.find((d: any) => d.quality === "160kbps")?.url ||
        downloadUrls.find((d: any) => d.quality === "96kbps")?.url ||
        downloadUrls[0]?.url ||
        song.audio_url;

      // Get primary artist names
      const primaryArtists = song.artists?.primary?.map((a: any) => a.name).join(", ") || 
                            song.primaryArtists || 
                            song.singers ||
                            "Unknown Artist";

      return {
        id: song.id,
        title: song.name || song.title,
        artist: primaryArtists,
        duration: parseInt(song.duration) || 0,
        audioUrl: audioUrl,
        imageUrl: typeof image === 'string' ? image : image?.url || null,
        albumName: song.album?.name || song.album || "",
        language: song.language || "",
        year: song.year || "",
      };
    }).filter((track: any) => track.audioUrl); // Only include tracks with valid audio URLs

    console.log(`Found ${tracks.length} tracks for query: ${query}`);

    return new Response(
      JSON.stringify({ tracks }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("JioSaavn search error:", error);
    const errorMessage = error instanceof Error ? error.message : "Search failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
