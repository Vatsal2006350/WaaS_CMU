// import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface Video {
  id: number | string;
  image: string;
  link: string;
}

// Custom hook for fetching and managing videos from Pexels API
export function usePexelsVideos() {
  // State for storing fetched videos
  const [videos, setVideos] = useState<Video[]>([]);

  // Function to fetch videos based on search query
  // const fetchVideos = async (query: string) => {
  //   setIsLoading(true);
  //   try {
  //     // Make API request to Pexels
  //     // Parameters:
  //     // - query: search term
  //     // - per_page: number of results to return
  //     // - size: size of videos to fetch
  //     // - orientation: aspect ratio of videos
  //     const response = await fetch(
  //       `https://api.pexels.com/videos/search?query=${query}&per_page=30&size=medium&orientation=landscape`,
  //       {
  //         headers: {
  //           Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY || "",
  //         },
  //       }
  //     );

  //     // Check if the request was successful
  //     if (!response.ok)
  //       throw new Error(`HTTP error! status: ${response.status}`);

  //     const data = await response.json();
  //     setVideos(data.videos);
  //   } catch (error) {
  //     // Log error and show user-friendly toast notification
  //     console.error("Error fetching Pexels media:", error);
  //     toast({
  //       title: "Error fetching media",
  //       description:
  //         "Failed to fetch media. Have you added your own Pexels API key?",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     // Reset loading state regardless of success/failure
  //     setIsLoading(false);
  //   }
  // };

  // Return hook values and functions
  return { videos, setVideos };
}
