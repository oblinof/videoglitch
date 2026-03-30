import type { GlitchEffect } from './types';
import * as GlitchAlgos from './services/glitchEffects';

export const INITIAL_EFFECTS: Omit<GlitchEffect, 'active' | 'intensity'>[] = [
    { id: 'advancedrgb', name: 'Advanced RGB', apply: GlitchAlgos.applyAdvancedRGB },
    { id: 'slicedrift', name: 'Slice Drift', apply: GlitchAlgos.applySliceDrift },
    { id: 'staticnoise', name: 'Static Noise', apply: GlitchAlgos.applyStaticNoise },
    { id: 'rollingbars', name: 'Rolling Bars', apply: GlitchAlgos.applyRollingBars },
    { id: 'datamosh', name: 'Data Mosh', apply: GlitchAlgos.applyDataMosh },
    { id: 'inversion', name: 'Inversion', apply: GlitchAlgos.applyInversion },
    { id: 'flicker', name: 'Flicker', apply: GlitchAlgos.applyFlicker },
    { id: 'pixelsort', name: 'Pixel Sort', apply: GlitchAlgos.applyPixelSort },
    { id: 'quantize', name: 'Quantize', apply: GlitchAlgos.applyQuantize },
    { id: 'wavewarp', name: 'Wave Warp', apply: GlitchAlgos.applyWaveWarp },
    { id: 'chromaticaberration', name: 'Chromatic Aberration', apply: GlitchAlgos.applyChromaticAberration },
    { id: 'badsignal', name: 'Bad Signal', apply: GlitchAlgos.applyBadSignal },
    { id: 'sharpen', name: 'Sharpen', apply: GlitchAlgos.applySharpen },
    { id: 'holoecho', name: 'Holo Echo', apply: GlitchAlgos.applyHoloEcho },
    { id: 'channelshuffle', name: 'Channel Shuffle', apply: GlitchAlgos.applyChannelShuffle },
    { id: 'feedbackloop', name: 'Feedback Loop', apply: GlitchAlgos.applyFeedbackLoop },
    { id: 'timelag', name: 'Time Lag', apply: GlitchAlgos.applyTimeLag },
    { id: 'blocknoise', name: 'Block Noise', apply: GlitchAlgos.applyBlockNoise },
    { id: 'liquify', name: 'Liquify', apply: GlitchAlgos.applyLiquify },
    { id: 'flow', name: 'Optical Flow', apply: GlitchAlgos.applyFlow },
].map(effect => ({
    ...effect,
    active: false,
    intensity: 0.5,
}));
