
import { useState, useRef, useEffect } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

// Extend the Window interface to include ffmpeg
declare global {
    interface Window {
        FFmpeg: any;
    }
}

const useFFmpeg = () => {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);

    const load = async () => {
        if (ffmpegRef.current) {
            return;
        }
        
        const { FFmpeg, toBlobURL } = window.FFmpeg;
        
        const ffmpeg = new FFmpeg();
        ffmpegRef.current = ffmpeg;
        
        ffmpeg.on('log', ({ message }) => {
            console.log(message);
        });

        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        setLoaded(true);
    };

    return { ffmpeg: ffmpegRef.current, loaded, load };
};

export default useFFmpeg;
