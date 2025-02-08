import { useEffect } from "react";

import { useEditorContext } from "../contexts/editor-context";
import { useTimelinePositioning } from "../hooks/use-timeline-positioning";
import { ClipOverlay } from "../types";
import { usePexelsVideos } from "../hooks/use-pexels-video";
import { useAspectRatio } from "../hooks/use-aspect-ratio";
import { useTimeline } from "../contexts/timeline-context";

interface Video {
  id: number | string;
  image: string;
  link: string;
}

export const ClipsPanel: React.FC<{ defaultVideos: Video[] }> = ({
  defaultVideos,
}) => {
  const { videos, setVideos } = usePexelsVideos();
  const { addOverlay, overlays, durationInFrames } = useEditorContext();
  const { findNextAvailablePosition } = useTimelinePositioning();
  const { getAspectRatioDimensions } = useAspectRatio();
  const { visibleRows } = useTimeline();

  const handleAddClip = (video: Video) => {
    const { width, height } = getAspectRatioDimensions();

    const { from, row } = findNextAvailablePosition(
      overlays,
      visibleRows,
      durationInFrames
    );

    // Find the best quality video file (prioritize UHD > HD > SD)
    const videoFile = video; // Fallback to first file if no matches

    const newOverlay: ClipOverlay = {
      left: 0,
      top: 0,
      width,
      height,
      durationInFrames: 200,
      from,
      id: Date.now(),
      rotation: 0,
      row,
      isDragging: false,
      type: "clip",
      content: video.image,
      src: videoFile?.link ?? "",
      videoStartTime: 0,
      styles: {
        opacity: 1,
        zIndex: 100,
        transform: "none",
        objectFit: "cover",
      },
    };

    addOverlay(newOverlay);
  };

  useEffect(() => {
    setVideos(defaultVideos);
  });

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-800/40 h-full">
      <div className="grid grid-cols-2 gap-3">
        {videos.map((video) => {
          console.log(video);
          return (
            <button
              key={video.id}
              className="relative aspect-video cursor-pointer border border-transparent hover:border-white rounded-md"
              onClick={() => handleAddClip(video)}
            >
              <div className="relative">
                <img
                  src={video.image}
                  alt={`Video thumbnail ${video.id}`}
                  className="rounded-sm object-cover w-full h-full hover:opacity-60 transition-opacity duration-200"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
