"use client";

import React, { useRef, useEffect } from "react";

interface AutoPlayVideoProps {
  src: string;
  className?: string;
  poster?: string;
  onLoadedData?: () => void;
  onError?: () => void;
}

const AutoPlayVideo: React.FC<AutoPlayVideoProps> = ({
  src,
  className = "",
  poster,
  onLoadedData,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
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
