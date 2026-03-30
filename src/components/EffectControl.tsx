
import React from 'react';
import type { GlitchEffect } from '../types';

interface EffectControlProps {
    effect: GlitchEffect;
    onEffectChange: (id: string, newValues: Partial<GlitchEffect>) => void;
}

const EffectControl: React.FC<EffectControlProps> = ({ effect, onEffectChange }) => {
    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEffectChange(effect.id, { active: e.target.checked });
    };

    const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
        onEffectChange(effect.id, { intensity: parseFloat(e.target.value) });
    };

    return (
        <div className={`p-3 rounded-md transition-all duration-300 ${effect.active ? 'bg-gray-700 shadow-inner' : 'bg-gray-800'}`}>
            <div className="flex items-center justify-between">
                <label htmlFor={`toggle-${effect.id}`} className="font-semibold select-none cursor-pointer text-gray-200">
                    {effect.name}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        id={`toggle-${effect.id}`}
                        checked={effect.active}
                        onChange={handleToggle}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyber-pink peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-pink"></div>
                </label>
            </div>
            {effect.active && (
                <div className="mt-3">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={effect.intensity}
                        onChange={handleSlider}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                    />
                </div>
            )}
        </div>
    );
};

export default EffectControl;
