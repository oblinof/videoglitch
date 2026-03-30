
import React, { useCallback, useState } from 'react';

interface FileUploaderProps {
    onFileChange: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File | null | undefined) => {
        if (file && file.type.startsWith('video/')) {
            onFileChange(file);
        } else {
            alert('Please upload a valid video file.');
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);
    
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFile(e.dataTransfer.files?.[0]);
    }, [onFileChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files?.[0]);
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <label
                htmlFor="dropzone-file"
                className={`flex flex-col items-center justify-center w-full max-w-2xl h-96 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-cyber-pink bg-light-bg' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-cyber-cyan">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">VERTICAL VIDEO (9:16 Recommended)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="video/*" onChange={handleChange} />
            </label>
        </div>
    );
};

export default FileUploader;
