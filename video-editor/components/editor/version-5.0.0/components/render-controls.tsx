import React from "react";
import { Download, Loader2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { Overlay } from "../types";

// Add this interface to track multiple renders
interface RenderItem {
  url?: string;
  timestamp: Date;
  id: string;
  status: "success" | "error";
  error?: string;
}

interface RenderControlsProps {
  state: any;
  setOverlays: (overlays: Overlay[]) => void;
  recommendedOverlays: Overlay[][];
  handleRender: () => void;
}

const overlayOne: Overlay[] = [
  {
    left: 0,
    top: 0,
    width: 1280,
    height: 720,
    durationInFrames: 114,
    from: 0,
    id: 0,
    rotation: 0,
    row: 1,
    isDragging: false,
    type: "clip",
    content:
      "https://images.pexels.com/videos/7664770/pexels-photo-7664770.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    src: "https://videos.pexels.com/video-files/8691736/8691736-uhd_1440_2732_24fps.mp4",
    videoStartTime: 0,
    styles: {
      opacity: 1,
      zIndex: 100,
      transform: "none",
      objectFit: "cover",
    },
  },
  {
    left: 0,
    top: 0,
    width: 1280,
    height: 720,
    durationInFrames: 70,
    from: 111,
    id: 3,
    rotation: 0,
    row: 2,
    isDragging: false,
    type: "clip",
    content:
      "https://images.pexels.com/videos/7649282/abstract-aircraft-alien-art-7649282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    src: "https://videos.pexels.com/video-files/5320011/5320011-uhd_1440_2560_25fps.mp4",
    videoStartTime: 0,
    styles: {
      opacity: 1,
      zIndex: 100,
      transform: "none",
      objectFit: "cover",
    },
  },
  {
    left: 470,
    top: 286,
    width: 348,
    height: 102,
    durationInFrames: 63,
    from: 117,
    id: 4,
    row: 1,
    rotation: 0,
    isDragging: false,
    type: "text",
    content: "AdDojo",
    styles: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "#F4F4F5",
      backgroundColor: "transparent",
      fontFamily: "font-sans",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1.2",
      textAlign: "center",
      opacity: 1,
      zIndex: 1,
      transform: "none",
    },
  },
  {
    left: 0,
    top: 0,
    width: 1280,
    height: 720,
    durationInFrames: 200,
    from: 176,
    id: 5,
    rotation: 0,
    row: 3,
    isDragging: false,
    type: "clip",
    content:
      "https://images.pexels.com/videos/7180706/pexels-photo-7180706.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    src: "https://videos.pexels.com/video-files/6254849/6254849-uhd_1440_2560_30fps.mp4",
    videoStartTime: 0,
    styles: {
      opacity: 1,
      zIndex: 100,
      transform: "none",
      objectFit: "cover",
    },
  },
  {
    left: 25,
    top: 15,
    width: 1229,
    height: 684,
    durationInFrames: 186,
    from: 184,
    id: 6,
    row: 2,
    rotation: 0,
    isDragging: false,
    type: "text",
    content: "Be a Better You",
    styles: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "#04283b",
      backgroundColor: "transparent",
      fontFamily: "font-sans",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1.2",
      textAlign: "center",
      opacity: 1,
      zIndex: 1,
      transform: "none",
    },
  },
  {
    id: 7,
    type: "sound",
    content: "Inspiring Cinematic",
    src: "https://rwxrdxvxndclnqvznxfj.supabase.co/storage/v1/object/public/sounds/sound-2.mp3?t=2024-11-04T03%3A52%3A27.497Z",
    from: 0,
    row: 4,
    left: 0,
    top: 0,
    width: 1920,
    height: 100,
    rotation: 0,
    isDragging: false,
    durationInFrames: 378,
    styles: {
      opacity: 1,
    },
  },
  {
    left: 826,
    top: 233,
    width: 446,
    height: 187,
    durationInFrames: 50,
    from: 62,
    id: 8,
    row: 0,
    rotation: 0,
    isDragging: false,
    type: "text",
    content: "Track Your Runs",
    styles: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "#F4F4F5",
      backgroundColor: "transparent",
      fontFamily: "font-sans",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1.2",
      textAlign: "center",
      opacity: 1,
      zIndex: 1,
      transform: "none",
    },
  },
];

const overlayTwo: Overlay[] = [
  {
    left: 0,
    top: 0,
    width: 1280,
    height: 720,
    durationInFrames: 114,
    from: 0,
    id: 0,
    rotation: 0,
    row: 1,
    isDragging: false,
    type: "clip",
    content:
      "https://images.pexels.com/videos/7664770/pexels-photo-7664770.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    src: "https://videos.pexels.com/video-files/5319426/5319426-sd_360_640_25fps.mp4",
    videoStartTime: 0,
    styles: {
      opacity: 1,
      zIndex: 100,
      transform: "none",
      objectFit: "cover",
    },
  },
  {
    left: 0,
    top: 0,
    width: 1280,
    height: 720,
    durationInFrames: 70,
    from: 111,
    id: 3,
    rotation: 0,
    row: 2,
    isDragging: false,
    type: "clip",
    content:
      "https://images.pexels.com/videos/7649282/abstract-aircraft-alien-art-7649282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    src: "https://videos.pexels.com/video-files/6389061/6389061-uhd_1440_2560_25fps.mp4",
    videoStartTime: 0,
    styles: {
      opacity: 1,
      zIndex: 100,
      transform: "none",
      objectFit: "cover",
    },
  },
  {
    left: 470,
    top: 286,
    width: 348,
    height: 102,
    durationInFrames: 63,
    from: 117,
    id: 4,
    row: 1,
    rotation: 0,
    isDragging: false,
    type: "text",
    content: "AdDojo",
    styles: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "#F4F4F5",
      backgroundColor: "transparent",
      fontFamily: "font-sans",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1.2",
      textAlign: "center",
      opacity: 1,
      zIndex: 1,
      transform: "none",
    },
  },
  {
    left: 0,
    top: 0,
    width: 1280,
    height: 720,
    durationInFrames: 200,
    from: 176,
    id: 5,
    rotation: 0,
    row: 3,
    isDragging: false,
    type: "clip",
    content:
      "https://images.pexels.com/videos/7180706/pexels-photo-7180706.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    src: "https://videos.pexels.com/video-files/5319761/5319761-uhd_1440_2560_25fps.mp4",
    videoStartTime: 0,
    styles: {
      opacity: 1,
      zIndex: 100,
      transform: "none",
      objectFit: "cover",
    },
  },
  {
    left: 25,
    top: 15,
    width: 1229,
    height: 684,
    durationInFrames: 186,
    from: 184,
    id: 6,
    row: 2,
    rotation: 0,
    isDragging: false,
    type: "text",
    content: "Train Hard",
    styles: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "#04283b",
      backgroundColor: "transparent",
      fontFamily: "font-sans",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1.2",
      textAlign: "center",
      opacity: 1,
      zIndex: 1,
      transform: "none",
    },
  },
  {
    id: 7,
    type: "sound",
    content: "Inspiring Cinematic",
    src: "https://rwxrdxvxndclnqvznxfj.supabase.co/storage/v1/object/public/sounds/sound-2.mp3?t=2024-11-04T03%3A52%3A27.497Z",
    from: 0,
    row: 4,
    left: 0,
    top: 0,
    width: 1920,
    height: 100,
    rotation: 0,
    isDragging: false,
    durationInFrames: 378,
    styles: {
      opacity: 1,
    },
  },
  {
    left: 826,
    top: 233,
    width: 446,
    height: 187,
    durationInFrames: 50,
    from: 62,
    id: 8,
    row: 0,
    rotation: 0,
    isDragging: false,
    type: "text",
    content: "Track Your Runs",
    styles: {
      fontSize: "3rem",
      fontWeight: "bold",
      color: "#F4F4F5",
      backgroundColor: "transparent",
      fontFamily: "font-sans",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1.2",
      textAlign: "center",
      opacity: 1,
      zIndex: 1,
      transform: "none",
    },
  },
];

const RenderControls: React.FC<RenderControlsProps> = ({
  state,
  setOverlays,
  recommendedOverlays,
  handleRender,
}) => {
  // Store multiple renders
  const [renders, setRenders] = React.useState<RenderItem[]>([]);
  // Track if there are new renders
  const [hasNewRender, setHasNewRender] = React.useState(false);

  // Add new render to the list when completed
  React.useEffect(() => {
    if (state.status === "done" && state.url) {
      setRenders((prev) => [
        {
          url: state.url!,
          timestamp: new Date(),
          id: crypto.randomUUID(),
          status: "success",
        },
        ...prev,
      ]);
      setHasNewRender(true);
    } else if (state.status === "error") {
      setRenders((prev) => [
        {
          timestamp: new Date(),
          id: crypto.randomUUID(),
          status: "error",
          error: "Failed to render video. Please try again.",
        },
        ...prev,
      ]);
      setHasNewRender(true);
    }
  }, [state.status, state.url]);

  const handleDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "rendered-video.mp4";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Popover onOpenChange={() => setHasNewRender(false)}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="relative bg-gray-800 hover:bg-gray-700"
          >
            <Bell className="w-4 h-4" />
            {hasNewRender && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-gray-900 border-gray-800">
          <div className="space-y-2">
            <h4 className="font-medium text-zinc-100">Recent Renders</h4>
            {renders.length === 0 ? (
              <p className="text-sm text-zinc-400">No renders yet</p>
            ) : (
              renders.map((render) => (
                <div
                  key={render.id}
                  className={`flex items-center justify-between rounded-lg border p-2 ${
                    render.status === "error"
                      ? "border-red-800 bg-red-950/50"
                      : "border-gray-800"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="text-sm text-zinc-200">
                      {render.status === "error" ? (
                        <span className="text-red-400 font-medium">
                          Render Failed
                        </span>
                      ) : (
                        new URL(render.url!).pathname.split("/").pop()
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(render.timestamp, {
                        addSuffix: true,
                      })}
                      {render.error && (
                        <div className="text-red-400 mt-1">{render.error}</div>
                      )}
                    </div>
                  </div>
                  {render.status === "success" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-zinc-200 hover:text-gray-800"
                      onClick={() => handleDownload(render.url!)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        onClick={handleRender}
        disabled={state.status === "rendering" || state.status === "invoking"}
        className="bg-gray-800 hover:bg-gray-700"
      >
        {state.status === "rendering" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Rendering... {(state.progress * 100).toFixed(0)}%
          </>
        ) : state.status === "invoking" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Preparing...
          </>
        ) : (
          "Render Video"
        )}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-gray-800 hover:bg-gray-700">
            Change Overlays
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 bg-gray-900 border-gray-800">
          <div className="space-y-2">
            <h4 className="font-medium text-zinc-100">Recommended Overlays</h4>
            {[overlayOne, overlayTwo].map((overlay: any, index: number) => (
              <Button
                key={index}
                onClick={() => {
                  setOverlays(overlay);
                }}
                className="w-full text-left bg-gray-800 hover:bg-gray-700"
              >
                {`Overlay ${index + 1}`}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default RenderControls;
