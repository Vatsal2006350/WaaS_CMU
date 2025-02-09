"use client";

import React from "react";
import { EditorHeader } from "./editor-header";
import { VideoPlayer } from "./video-player";

import Timeline from "./timeline";
import { useEditorContext } from "../contexts/editor-context";
import { TimelineControls } from "./timeline-controls";
import { FPS } from "../constants";
import { Overlay } from "../types";

/**
 * Editor Component
 *
 * Main editor interface that combines video playback, timeline controls, and overlay management.
 * Handles the layout and coordination between different editor components using the EditorContext.
 */
interface EditorProps {
  setOverlays: React.Dispatch<React.SetStateAction<Overlay[]>>;
  recommendedOverlays: Overlay[][];
}

export const Editor: React.FC<EditorProps> = ({
  setOverlays,
  recommendedOverlays,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    overlays,
    selectedOverlayId,
    setSelectedOverlayId,
    isPlaying,
    currentFrame,
    playerRef,
    togglePlayPause,
    formatTime,
    handleOverlayChange,
    handleTimelineClick,
    deleteOverlay,
    duplicateOverlay,
    splitOverlay,
    durationInFrames: originalDurationInFrames,
  } = useEditorContext();

  const durationInFrames = isNaN(originalDurationInFrames)
    ? 100
    : originalDurationInFrames;

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 p-6">
        <div className="text-center text-white">
          <h2 className="text-xl font-bold mb-2">Desktop Only</h2>
          <p className="text-sm text-gray-400 font-light mb-2">
            The video editor is optimized for desktop devices only. For a
            mobile-friendly experience, use the Version 3.0.0 component.
          </p>
          <p className="text-sm text-gray-400 font-light">
            Note, Were working on bringing full mobile support to this version
            soon 👀
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-900 h-screen">
      <EditorHeader
        setOverlays={setOverlays}
        recommendedOverlays={recommendedOverlays}
      />
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden ">
        <VideoPlayer playerRef={playerRef} />
      </div>

      <TimelineControls
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        currentFrame={currentFrame}
        totalDuration={durationInFrames}
        formatTime={formatTime}
      />

      <Timeline
        currentFrame={currentFrame}
        overlays={overlays}
        durationInFrames={durationInFrames}
        selectedOverlayId={selectedOverlayId}
        setSelectedOverlayId={setSelectedOverlayId}
        onOverlayChange={handleOverlayChange}
        onOverlayDelete={deleteOverlay}
        onOverlayDuplicate={duplicateOverlay}
        onSplitOverlay={splitOverlay}
        setCurrentFrame={(frame) => {
          if (playerRef.current) {
            playerRef.current.seekTo(frame / FPS);
          }
        }}
        onTimelineClick={handleTimelineClick}
      />
    </div>
  );
};
