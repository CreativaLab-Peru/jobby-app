"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

interface AutoPlayVideoProps {
  src: string;
  lightSrc?: string;
  darkSrc?: string;
  className?: string;
  poster?: string;
  onLoadedData?: () => void;
  onError?: () => void;
}

const AutoPlayVideo: React.FC<AutoPlayVideoProps> = ({
  src,
  lightSrc,
  darkSrc,
  className = "",
  poster,
  onLoadedData,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { resolvedTheme } = useTheme();

  const selectedSrc = useMemo(() => {
    if (!lightSrc && !darkSrc) {
      return src;
    }

    const theme = resolvedTheme === "dark" ? "dark" : "light";
    if (theme === "dark") {
      return darkSrc ?? lightSrc ?? src;
    }

    return lightSrc ?? darkSrc ?? src;
  }, [darkSrc, lightSrc, resolvedTheme, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure autoplay works even with strict browser policies
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.error("Autoplay failed:", error);
      }
    };

    playVideo();
  }, [selectedSrc]);

  return (
    <video
      key={selectedSrc}
      ref={videoRef}
      src={selectedSrc}
      className={`w-full h-auto ${className}`}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onLoadedData={onLoadedData}
      onError={onError}
    />
  );
};

export default AutoPlayVideo;
