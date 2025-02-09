// Base overlay properties
type BaseOverlay = {
  id: number;
  durationInFrames: number;
  from: number;
  height: number;
  row: number;
  left: number;
  top: number;
  width: number;
  isDragging: boolean;
  rotation: number;
  type: "text" | "image" | "shape" | "clip" | "sound";
};

// Base style properties
type BaseStyles = {
  opacity?: number;
  zIndex?: number;
  transform?: string;
};

// Text overlay specific
export type TextOverlay = BaseOverlay & {
  type: "text";
  content: string;
  styles: BaseStyles & {
    fontSize: string;
    fontWeight: string;
    color: string;
    backgroundColor: string;
    fontFamily: string;
    fontStyle: string;
    textDecoration: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: "left" | "center" | "right";
    textShadow?: string;
  };
};

// Image overlay specific
export type ImageOverlay = BaseOverlay & {
  type: "image";
  content: string;
  styles: BaseStyles & {
    objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
    objectPosition?: string;
    filter?: string;
    borderRadius?: string;
  };
};

// Shape overlay specific
export type ShapeOverlay = BaseOverlay & {
  type: "shape";
  content: string;
  styles: BaseStyles & {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    borderRadius?: string;
    boxShadow?: string;
    gradient?: string;
  };
};

// Clip overlay specific
export type ClipOverlay = BaseOverlay & {
  type: "clip";
  content: string; // Thumbnail URL for preview
  src: string; // Actual video source URL
  videoStartTime?: number; // Optional start time for the video
  styles: BaseStyles & {
    objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
    objectPosition?: string;
  };
};

// Sound overlay specific
export type SoundOverlay = BaseOverlay & {
  type: "sound";
  content: string;
  src: string;
  startFromSound?: number;
  styles: BaseStyles;
};

export type Overlay =
  | TextOverlay
  | ImageOverlay
  | ShapeOverlay
  | ClipOverlay
  | SoundOverlay;

export function convertLLMInputToEditorProps(LLMInput: string): Overlay[] {
  const parsedInput = JSON.parse(LLMInput);

  const textOverlays: TextOverlay[] = parsedInput.Text.map(
    (textItem: any, index: number) => ({
      id: index,
      type: "text",
      content: textItem.text,
      durationInFrames: Math.round(textItem.Duration * 30),
      from: textItem.startTime,
      height: 100,
      width: 300,
      left: 0,
      top: 0,
      row: index,
      isDragging: false,
      rotation: 0,
      styles: {
        fontSize: "16px",
        fontWeight: "normal",
        color: "#000000",
        backgroundColor: "transparent",
        fontFamily: "Arial",
        fontStyle: "normal",
        textDecoration: "none",
        textAlign: "left",
      },
    })
  );

  const clipOverlays: ClipOverlay[] = parsedInput.Clips.map(
    (clipItem: any, index: number) => ({
      id: textOverlays.length + index,
      type: "clip",
      content: clipItem.Url,
      src: clipItem.Url,
      durationInFrames: clipItem.Duration * 30,
      from: clipItem.startTime * 30,
      height: 720,
      width: 1280,
      left: 0,
      top: 0,
      row: textOverlays.length + index,
      isDragging: false,
      rotation: 0,
      styles: {
        objectFit: "cover",
      },
    })
  );

  const soundOverlays: SoundOverlay[] = parsedInput.VoiceOver.map(
    (voiceItem: any, index: number) => ({
      id: textOverlays.length + clipOverlays.length + index,
      type: "sound",
      content: voiceItem.Text,
      src: voiceItem.Text,
      durationInFrames: Math.round(voiceItem.Duration * 30),
      from: Math.round(voiceItem.startTime * 30),
      height: 100,
      width: 1920,
      left: 0,
      top: 0,
      row: textOverlays.length + clipOverlays.length + index,
      isDragging: false,
      rotation: 0,
      styles: {},
    })
  );

  return [...textOverlays, ...clipOverlays, ...soundOverlays];
}

const LLMInput = `{
  "Clips": [
    {
      "Url": "/Users/aryansawhney/ingestion_pipeline/vids/7113fc16-f078-4d82-82f2-73457f8553c0.mp4",
      "startTime": 0,
      "Duration": 30
    },
    {
      "Url": "/Users/aryansawhney/ingestion_pipeline/vids/c3689d7d-ae73-4f0a-b031-2388b5d568f4.mp4",
      "startTime": 0,
      "Duration": 30
    },
    {
      "Url": "/Users/aryansawhney/ingestion_pipeline/vids/3f422c0d-d510-4723-a138-8cdb4cfd6bc5.mp4",
      "startTime": 0,
      "Duration": 30
    }
  ],
  "Text": [
    {
      "text": "How are you feeling, really?",
      "startTime": 0,
      "Duration": 30
    },
    {
      "text": "Take a moment to reflect.",
      "startTime": 30,
      "Duration": 30
    },
    {
      "text": "Find your peace and happiness.",
      "startTime": 60,
      "Duration": 30
    }
  ],
  "VoiceOver": [
    {
      "Text": "How are you feeling, really?",
      "startTime": 0,
      "Duration": 30
    },
    {
      "Text": "Take a moment to reflect.",
      "startTime": 30,
      "Duration": 30
    },
    {
      "Text": "Find your peace and happiness.",
      "startTime": 60,
      "Duration": 30
    }
  ]
}`;

console.log(convertLLMInputToEditorProps(LLMInput));
