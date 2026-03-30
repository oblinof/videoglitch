
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { GlitchEffect } from './types';
import { INITIAL_EFFECTS } from './constants';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import VideoPlayer from './components/VideoPlayer';
import EffectsPanel from './components/EffectsPanel';
import useFFmpeg from './hooks/useFFmpeg';
import Spinner from './components/Spinner';

const App: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [effects, setEffects] = useState<GlitchEffect[]>(INITIAL_EFFECTS);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const [exportProgress, setExportProgress] = useState<string>('');
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const { ffmpeg, loaded, load } = useFFmpeg();

    useEffect(() => {
      // Pre-load ffmpeg as soon as the app loads
      if(!loaded) {
          load();
      }
    }, [loaded, load]);

    useEffect(() => {
        let objectUrl: string | null = null;
        if (videoFile) {
            objectUrl = URL.createObjectURL(videoFile);
            setVideoUrl(objectUrl);
        } else {
            setVideoUrl(null);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [videoFile]);

    const handleFileChange = (file: File) => {
        setVideoFile(file);
    };

    const updateEffect = useCallback((id: string, newValues: Partial<GlitchEffect>) => {
        setEffects(prevEffects =>
            prevEffects.map(effect =>
                effect.id === id ? { ...effect, ...newValues } : effect
            )
        );
    }, []);

    const handleExport = async () => {
        if (!videoFile) {
             alert('Please upload a video first.');
             return;
        }
        if (!loaded || !ffmpeg?.isLoaded()) {
            alert('FFmpeg is not ready. Please wait.');
            return;
        }
        
        setIsExporting(true);
        setExportProgress('Export is a complex operation and currently a placeholder. See console for implementation details.');

        console.log("--- Real FFmpeg Export Would Happen Here ---");
        console.log("The process involves rendering each frame with effects to a canvas, saving it, and using FFmpeg to compile the frames into a video.");
        console.log("This is computationally intensive and has been left as a placeholder to focus on the real-time preview performance and effects quality.");

        setTimeout(() => {
            setIsExporting(false);
            setExportProgress('');
            alert('Export functionality is a placeholder. Check the browser console for an implementation guide.');
        }, 5000);
    };

    const activeEffects = effects.filter(e => e.active);

    return (
        <div className="h-screen bg-dark-bg text-gray-200 font-sans flex flex-col">
            {isExporting && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
                    <Spinner />
                    <p className="mt-4 text-lg text-cyber-cyan animate-pulse">{exportProgress || 'Processing video...'}</p>
                </div>
            )}
            <Header />
            <main className="p-4 md:p-8 flex-grow min-h-0 flex flex-col">
                {!videoUrl ? (
                    <FileUploader onFileChange={handleFileChange} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
                        <div className="lg:col-span-2 flex justify-center items-start">
                             <div className="w-full max-w-md"> {/* Container for vertical player */}
                                <VideoPlayer
                                    src={videoUrl}
                                    activeEffects={activeEffects}
                                    videoRef={videoRef}
                                />
                             </div>
                        </div>
                        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
                            <EffectsPanel effects={effects} onEffectChange={updateEffect} />
                            <div className="bg-light-bg p-4 rounded-lg shadow-lg flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-cyber-cyan">Export</h2>
                                    <button
                                        onClick={handleExport}
                                        disabled={isExporting || !loaded}
                                        className="px-6 py-2 bg-cyber-pink hover:bg-opacity-80 text-white font-bold rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
                                    >
                                        { !loaded ? 'Loading FFmpeg...' : 'Export MP4' }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
