"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMusic, FaPlay, FaPause, FaTimes, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useLanguage } from "@/shared/lib/language-context";
import * as musicMetadata from "music-metadata-browser";

interface TrackMeta {
  title: string;
  artist: string;
  cover: string | null;
}

export function MusicPlayer() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [trackMeta, setTrackMeta] = useState<TrackMeta>({
    title: "Загрузка...",
    artist: "Загрузка...",
    cover: null,
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch("/popal.mp3");
        const blob = await response.blob();
        const metadata = await musicMetadata.parseBlob(blob);
        
        let coverUrl: string | null = null;
        const picture = metadata.common.picture?.[0];
        if (picture) {
          const uint8Array = new Uint8Array(picture.data);
          const blob = new Blob([uint8Array], { type: picture.format });
          coverUrl = URL.createObjectURL(blob);
        }

        setTrackMeta({
          title: metadata.common.title || "Неизвестный трек",
          artist: metadata.common.artist || "Неизвестный артист",
          cover: coverUrl,
        });
      } catch {
        setTrackMeta({
          title: "popal",
          artist: "Unknown",
          cover: null,
        });
      }
    };

    loadMetadata();
  }, []);

  useEffect(() => {
    const audio = new Audio("/popal.mp3");
    audio.volume = 0.3;
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      if (!isDraggingProgress) {
        setCurrentTime(audio.currentTime);
      }
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      audio.currentTime = 0;
      setCurrentTime(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [isDraggingProgress]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Progress bar handlers
  const handleProgressChange = (clientX: number) => {
    if (!progressRef.current || !audioRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDraggingProgress(true);
    handleProgressChange(e.clientX);
  };

  const handleProgressTouchStart = (e: React.TouchEvent) => {
    setIsDraggingProgress(true);
    handleProgressChange(e.touches[0].clientX);
  };

  // Volume handlers
  const handleVolumeChange = (clientX: number) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setVolume(percent);
    if (audioRef.current) {
      audioRef.current.volume = percent;
    }
    if (percent > 0) setIsMuted(false);
  };

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    setIsDraggingVolume(true);
    handleVolumeChange(e.clientX);
  };

  const handleVolumeTouchStart = (e: React.TouchEvent) => {
    setIsDraggingVolume(true);
    handleVolumeChange(e.touches[0].clientX);
  };

  // Global mouse/touch move and up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingProgress) handleProgressChange(e.clientX);
      if (isDraggingVolume) handleVolumeChange(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingProgress) handleProgressChange(e.touches[0].clientX);
      if (isDraggingVolume) handleVolumeChange(e.touches[0].clientX);
    };
    const handleEnd = () => {
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);
    };

    if (isDraggingProgress || isDraggingVolume) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDraggingProgress, isDraggingVolume, duration]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl
          hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Music player"
      >
        <FaMusic 
          className={`w-5 h-5 transition-all duration-300 ${
            isPlaying && !isOpen 
              ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
              : "text-primary dark:text-dark-primary"
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay для закрытия на мобильных */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-full sm:mt-2 w-auto sm:w-72 z-50"
            >
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-black/80 backdrop-blur-xl 
                border border-black/10 dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-black/30">
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full 
                    bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors z-10"
                >
                  <FaTimes className="w-4 h-4 text-primary dark:text-dark-primary" />
                </button>

              <p className="text-xs text-secondary dark:text-dark-secondary mb-2">
                {language === "ru" ? "Мини-плеер" : "Mini Player"}
              </p>

              <p className="text-xs text-secondary/70 dark:text-dark-secondary/70 mb-4 leading-relaxed pr-6">
                {language === "ru" 
                  ? "Здесь оставил свою любимую песню, откуда и взял основную аватарку :) Можете послушать пока гуляете по портфолио"
                  : "Here's my favorite song, where I got my main avatar from :) Feel free to listen while browsing my portfolio"}
              </p>

              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 
                bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                {trackMeta.cover ? (
                  <img src={trackMeta.cover} alt={trackMeta.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaMusic className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              <div className="text-center mb-4">
                <p className="text-sm font-medium text-primary dark:text-dark-primary truncate">{trackMeta.title}</p>
                <p className="text-xs text-secondary dark:text-dark-secondary truncate">{trackMeta.artist}</p>
              </div>

              {/* Progress bar with draggable thumb */}
              <div
                ref={progressRef}
                className="relative h-2 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer mb-2 group"
                onMouseDown={handleProgressMouseDown}
                onTouchStart={handleProgressTouchStart}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-black/60 dark:bg-white/60 rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-black dark:bg-white rounded-full shadow-md
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-secondary dark:text-dark-secondary mb-4">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex justify-center mb-4">
                <motion.button
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full 
                    bg-black dark:bg-white hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.95 }}
                >
                  {isPlaying ? (
                    <FaPause className="w-5 h-5 text-white dark:text-black" />
                  ) : (
                    <FaPlay className="w-5 h-5 text-white dark:text-black ml-0.5" />
                  )}
                </motion.button>
              </div>

              {/* Volume with draggable thumb */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-6 h-6 flex items-center justify-center text-secondary dark:text-dark-secondary 
                    hover:text-primary dark:hover:text-dark-primary transition-colors flex-shrink-0"
                >
                  {isMuted || volume === 0 ? <FaVolumeMute className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
                </button>
                <div
                  ref={volumeRef}
                  className="relative flex-1 h-2 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer group"
                  onMouseDown={handleVolumeMouseDown}
                  onTouchStart={handleVolumeTouchStart}
                >
                  <div
                    className="absolute left-0 top-0 h-full bg-black/60 dark:bg-white/60 rounded-full transition-all duration-75"
                    style={{ width: `${volumePercent}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-black dark:bg-white rounded-full shadow-md
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ left: `calc(${volumePercent}% - 6px)` }}
                  />
                </div>
                <span className="text-[10px] text-secondary dark:text-dark-secondary w-8 text-right flex-shrink-0">
                  {Math.round(volumePercent)}%
                </span>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
