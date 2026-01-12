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
      setCurrentTime(audio.currentTime);
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
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  };

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

  return (
    <div className="relative">
      {/* Кнопка музыки - без обводки, как GitHub */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl
          hover:bg-white/10 dark:hover:bg-white/5
          transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Music player"
      >
        {/* Иконка с glow внутри когда играет */}
        <FaMusic 
          className={`w-5 h-5 transition-all duration-300 ${
            isPlaying && !isOpen 
              ? "text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
              : "text-primary dark:text-dark-primary"
          }`} 
        />
      </motion.button>

      {/* Мини-плеер */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-72 z-50"
            style={{ right: "max(-1rem, calc(-50vw + 50% + 1rem))" }}
          >
            <div className="p-4 rounded-2xl 
              bg-white/80 dark:bg-black/50 
              backdrop-blur-xl 
              border border-black/10 dark:border-white/10 
              shadow-xl shadow-black/10 dark:shadow-black/30"
            >
              {/* Кнопка закрытия */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full 
                  bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 
                  transition-colors z-10"
              >
                <FaTimes className="w-3 h-3 text-secondary dark:text-dark-secondary" />
              </button>

              {/* Заголовок */}
              <p className="text-xs text-secondary dark:text-dark-secondary mb-2">
                {language === "ru" ? "Мини-плеер" : "Mini Player"}
              </p>

              {/* Описание */}
              <p className="text-xs text-secondary/70 dark:text-dark-secondary/70 mb-4 leading-relaxed pr-6">
                {language === "ru" 
                  ? "Здесь оставил свою любимую песню, откуда и взял основную аватарку :) Можете послушать пока гуляете по портфолио"
                  : "Here's my favorite song, where I got my main avatar from :) Feel free to listen while browsing my portfolio"}
              </p>

              {/* Обложка - большая квадратная */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 
                bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
              >
                {trackMeta.cover ? (
                  <img
                    src={trackMeta.cover}
                    alt={trackMeta.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaMusic className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>

              {/* Название и артист */}
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-primary dark:text-dark-primary truncate">
                  {trackMeta.title}
                </p>
                <p className="text-xs text-secondary dark:text-dark-secondary truncate">
                  {trackMeta.artist}
                </p>
              </div>

              {/* Прогресс бар */}
              <div
                className="h-1 bg-black/10 dark:bg-white/10 rounded-full cursor-pointer mb-2 overflow-hidden"
                onClick={handleSeek}
              >
                <motion.div
                  className="h-full bg-black/60 dark:bg-white/60 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Время */}
              <div className="flex items-center justify-between text-[10px] text-secondary dark:text-dark-secondary mb-4">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Play/Pause по центру */}
              <div className="flex justify-center mb-4">
                <motion.button
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full 
                    bg-black dark:bg-white hover:scale-105 transition-transform"
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isPlaying ? (
                      <motion.div
                        key="pause"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <FaPause className="w-5 h-5 text-white dark:text-black" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="play"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <FaPlay className="w-5 h-5 text-white dark:text-black ml-0.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Громкость */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-6 h-6 flex items-center justify-center text-secondary dark:text-dark-secondary 
                    hover:text-primary dark:hover:text-dark-primary transition-colors flex-shrink-0"
                >
                  {isMuted || volume === 0 ? (
                    <FaVolumeMute className="w-4 h-4" />
                  ) : (
                    <FaVolumeUp className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-black
                    dark:[&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-3
                    [&::-moz-range-thumb]:h-3
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-black
                    dark:[&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer"
                />
                <span className="text-[10px] text-secondary dark:text-dark-secondary w-8 text-right flex-shrink-0">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
