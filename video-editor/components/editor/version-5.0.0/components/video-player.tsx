import React, { useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Main } from "../remotion/main";
import { useEditorContext } from "../contexts/editor-context";
import { FPS } from "../constants";

/**
 * Props for the VideoPlayer component
 * @interface VideoPlayerProps
 * @property {React.RefObject<PlayerRef>} playerRef - Reference to the Remotion player instance
 */
interface VideoPlayerProps {
  playerRef: React.RefObject<PlayerRef>;
}

/**
 * VideoPlayer component that renders a responsive video editor with overlay support
 * The player automatically resizes based on its container and maintains the specified aspect ratio
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({ playerRef }) => {
  const {
    overlays,
    setSelectedOverlayId,
    changeOverlay,
    selectedOverlayId,
    aspectRatio,
    playerDimensions,
    updatePlayerDimensions,
    getAspectRatioDimensions,
    durationInFrames,
  } = useEditorContext();

  /**
   * Updates the player dimensions when the container size or aspect ratio changes
   */
  useEffect(() => {
    const handleDimensionUpdate = () => {
      const videoContainer = document.querySelector(".video-container");
      if (!videoContainer) return;

      const { width, height } = videoContainer.getBoundingClientRect();
      updatePlayerDimensions(width, height);
    };

    handleDimensionUpdate(); // Initial update
    window.addEventListener("resize", handleDimensionUpdate);

    return () => {
      window.removeEventListener("resize", handleDimensionUpdate);
    };
  }, [aspectRatio, updatePlayerDimensions]);

  const { width: compositionWidth, height: compositionHeight } =
    getAspectRatioDimensions();

  // Constants for player configuration
  const PLAYER_CONFIG = {
    durationInFrames: durationInFrames,
    fps: FPS,
  };

  return (
    <div className="w-full lg:h-full">
      {/* Grid background container */}
      <div
        className="z-0 video-container relative w-full h-full p-4 
        bg-gray-800/70 
        bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
        bg-[size:24px_24px] 
        shadow-lg 
        border border-white/5"
      >
        {/* Player wrapper with centering */}
        <div className="z-10 absolute inset-4 flex items-center justify-center">
          <div
            className="relative "
            style={{
              width: Math.min(playerDimensions.width, compositionWidth),
              height: Math.min(playerDimensions.height, compositionHeight),
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <Player
              ref={playerRef}
              className="w-full h-full"
              component={Main}
              compositionWidth={compositionWidth}
              compositionHeight={compositionHeight}
              style={{ width: "100%", height: "100%" }}
              durationInFrames={
                isNaN(PLAYER_CONFIG.durationInFrames)
                  ? 100
                  : PLAYER_CONFIG.durationInFrames
              }
              fps={isNaN(PLAYER_CONFIG.fps) ? 30 : PLAYER_CONFIG.fps}
              inputProps={{
                overlays,
                setSelectedOverlayId,
                changeOverlay,
                selectedOverlayId,
                durationInFrames,
                fps: FPS,
                width: compositionWidth,
                height: compositionHeight,
              }}
              errorFallback={() => <>Error - Something went wrong</>}
              overflowVisible
            />
          </div>
        </div>
      </div>
    </div>
  );
};
