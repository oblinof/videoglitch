import React from 'react';
import type { GlitchEffect } from '../types';
import EffectControl from './EffectControl';

interface EffectsPanelProps {
    effects: GlitchEffect[];
    onEffectChange: (id: string, newValues: Partial<GlitchEffect>) => void;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ effects, onEffectChange }) => {
    return (
        <div className="bg-light-bg p-4 rounded-lg shadow-lg flex-grow flex flex-col min-h-0">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-cyber-pink pb-2 text-cyber-cyan flex-shrink-0">Effects Controls</h2>
            <div className="space-y-4 overflow-y-auto flex-grow pr-2">
                {effects.map(effect => (
                    <EffectControl
                        key={effect.id}
                        effect={effect}
                        onEffectChange={onEffectChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default EffectsPanel;
