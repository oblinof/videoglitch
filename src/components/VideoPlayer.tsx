
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { GlitchEffect } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

declare global {
    interface HTMLVideoElement {
        requestVideoFrameCallback(callback: (now: number, metadata: any) => void): number;
        cancelVideoFrameCallback(id: number): void;
    }
}

interface VideoPlayerProps {
    src: string;
    activeEffects: GlitchEffect[];
    videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, activeEffects, videoRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Effect for setup and teardown, runs once on mount.
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // 1. Initialize Worker with a stable absolute path
        const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' });
        workerRef.current = worker;
        const offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ type: 'init', payload: { canvas: offscreen } }, [offscreen]);

        // 2. Setup Video Rendering Logic
        let frameCallbackId: number;
        const renderLoop = () => {
            if (!video.paused && video.videoWidth > 0 && workerRef.current) {
                createImageBitmap(video).then(bitmap => {
                    workerRef.current?.postMessage({ type: 'draw', payload: { frame: bitmap } }, [bitmap]);
                });
            }
            frameCallbackId = video.requestVideoFrameCallback(renderLoop);
        };

        const drawInitialFrame = async () => {
            if (video.readyState >= 2) { // HAVE_CURRENT_DATA or more
                if (canvasRef.current) {
                  canvasRef.current.width = video.videoWidth;
                  canvasRef.current.height = video.videoHeight;
                }
                const bitmap = await createImageBitmap(video);
                workerRef.current?.postMessage({ type: 'draw', payload: { frame: bitmap } }, [bitmap]);
            }
        };
        
        const handleLoadedData = async () => {
            await drawInitialFrame();
            try {
                // Programmatic play is more reliable than the autoplay attribute
                await video.play();
            } catch (error) {
                console.error("Autoplay was prevented:", error);
                setIsPlaying(false); // Update UI to show video is paused
            }
        };

        // 3. Define Event Handlers (as named functions for correct removal)
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        // 4. Attach Event Listeners
        video.addEventListener('loadeddata', handleLoadedData);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('timeupdate', handleTimeUpdate);

        // 5. Start Render Loop
        frameCallbackId = video.requestVideoFrameCallback(renderLoop);

        // 6. Cleanup function to run on component unmount
        return () => {
            worker.postMessage({ type: 'clear' });
            worker.terminate();
            if (video) {
                video.pause();
                video.cancelVideoFrameCallback(frameCallbackId);
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('timeupdate', handleTimeUpdate);
            }
        };
    }, [videoRef]); // This effect runs only once.

    // Effect to handle changes in the video source URL
    useEffect(() => {
        const video = videoRef.current;
        if (video && src && video.src !== src) {
            video.src = src;
            video.load(); // Important: call load() to process the new source
        }
    }, [src, videoRef]);

    // Effect to update the worker with the latest active effects
    useEffect(() => {
        if (workerRef.current) {
            const serializableEffects = activeEffects.map(({ apply, ...rest }) => rest);
            workerRef.current.postMessage({
                type: 'updateEffects',
                payload: { effects: serializableEffects },
            });
        }
    }, [activeEffects]);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play().catch(e => console.error("Error playing video:", e));
            } else {
                video.pause();
            }
        }
    }, [videoRef]);

    const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (video) {
            const newTime = (Number(e.target.value) / 100) * video.duration;
            video.currentTime = newTime;
            // Manually render a frame on scrub while paused
            if (video.paused) {
                video.onseeked = () => {
                     if (video.readyState >= 2 && workerRef.current) {
                        createImageBitmap(video).then(bitmap => {
                            workerRef.current?.postMessage({ type: 'draw', payload: { frame: bitmap } }, [bitmap]);
                        });
                    }
                    video.onseeked = null;
                }
            }
        }
    }, [videoRef]);

    return (
        <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden shadow-2xl shadow-cyber-pink/20">
            <video ref={videoRef} loop muted playsInline className="absolute w-px h-px -left-full -top-full" />
            <canvas ref={canvasRef} className="w-full h-full" onClick={togglePlay} />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="text-white hover:text-cyber-pink transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleProgressChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-pink"
                        aria-label="Video progress scrubber"
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
