import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX, Maximize, Minimize, Play, Pause, Settings, Share2, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  streamUrl?: string;
  title: string;
  isLive?: boolean;
}

export function VideoPlayer({ streamUrl, title, isLive = true }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsRef.current.loadSource(streamUrl);
      hlsRef.current.attachMedia(videoRef.current);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            // Autoplay was prevented
            setIsPlaying(false);
          });
        }
      });

      hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Network error occurred. Please check your connection.');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Media error occurred. The stream may be unavailable.');
              break;
            default:
              setError('An error occurred while playing the stream.');
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });
      videoRef.current.addEventListener('error', () => {
        setError('Error loading the stream.');
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900">
          <div className="text-center p-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          <video
            ref={videoRef}
            className="w-full h-full"
            playsInline
            muted={isMuted}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                <button onClick={togglePlay} className="hover:text-blue-400">
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={toggleMute} className="hover:text-blue-400">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <div className="text-sm font-medium">
                  {title}
                  {isLive && (
                    <span className="ml-2 bg-red-600 px-2 py-0.5 rounded-full text-xs">
                      LIVE
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="hover:text-blue-400">
                  <Settings size={20} />
                </button>
                <button className="hover:text-blue-400">
                  <Share2 size={20} />
                </button>
                <button onClick={toggleFullscreen} className="hover:text-blue-400">
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}