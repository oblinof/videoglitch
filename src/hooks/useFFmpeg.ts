
import { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const useFFmpeg = () => {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);

    const load = useCallback(async () => {
        if (ffmpegRef.current || loaded) {
            return;
        }

        try {
            const ffmpeg = new FFmpeg();
            ffmpegRef.current = ffmpeg;
            
            ffmpeg.on('log', ({ message }) => {
                // console.log(message); // Can be noisy, uncomment for debugging
            });
    
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
    
            setLoaded(true);
        } catch (error) {
            console.error("Fatal: Failed to load FFmpeg.", error);
        }

    }, [loaded]);

    return { ffmpeg: ffmpegRef.current, loaded, load };
};

export default useFFmpeg;
