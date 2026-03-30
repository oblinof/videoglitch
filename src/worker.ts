
import type { GlitchEffect } from './types';
import * as GlitchAlgos from './services/glitchEffects';

let canvas: OffscreenCanvas | null = null;
let ctx: OffscreenCanvasRenderingContext2D | null = null;
// The `apply` function can't be passed to a worker, so we only receive the effect data
let activeEffects: Omit<GlitchEffect, 'apply'>[] = []; 
let lastFrame: ImageBitmap | null = null;

// Create a map of effect IDs to their `apply` functions, which live only in the worker
const allEffectsMap: Map<string, GlitchEffect['apply']> = new Map([
    ['advancedrgb', GlitchAlgos.applyAdvancedRGB],
    ['slicedrift', GlitchAlgos.applySliceDrift],
    ['staticnoise', GlitchAlgos.applyStaticNoise],
    ['rollingbars', GlitchAlgos.applyRollingBars],
    ['datamosh', GlitchAlgos.applyDataMosh],
    ['inversion', GlitchAlgos.applyInversion],
    ['flicker', GlitchAlgos.applyFlicker],
    ['pixelsort', GlitchAlgos.applyPixelSort],
    ['quantize', GlitchAlgos.applyQuantize],
    ['wavewarp', GlitchAlgos.applyWaveWarp],
    ['chromaticaberration', GlitchAlgos.applyChromaticAberration],
    ['badsignal', GlitchAlgos.applyBadSignal],
    ['sharpen', GlitchAlgos.applySharpen],
    ['holoecho', GlitchAlgos.applyHoloEcho],
    ['channelshuffle', GlitchAlgos.applyChannelShuffle],
    ['feedbackloop', GlitchAlgos.applyFeedbackLoop],
    ['timelag', GlitchAlgos.applyTimeLag],
    ['blocknoise', GlitchAlgos.applyBlockNoise],
    ['liquify', GlitchAlgos.applyLiquify],
    ['flow', GlitchAlgos.applyFlow],
]);


self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    switch (type) {
        case 'init':
            canvas = payload.canvas as OffscreenCanvas;
            ctx = canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;
            break;

        case 'updateEffects':
            activeEffects = payload.effects;
            break;

        case 'draw':
            if (!ctx || !canvas) return;
            const frame = payload.frame as ImageBitmap;

            // Draw the new frame first, as some effects read from it
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

            // Apply active effects
            if (activeEffects.length > 0) {
                activeEffects.forEach(effect => {
                    const applyFn = allEffectsMap.get(effect.id);
                    if (applyFn) {
                        try {
                            ctx!.save();
                            // The apply function uses the currently drawn frame and the last frame for temporal effects
                            applyFn(ctx!, frame, lastFrame, canvas!.width, canvas!.height, effect.intensity);
                            ctx!.restore();
                        } catch (err) {
                            console.error(`Error applying effect in worker: ${effect.name}`, err);
                        }
                    }
                });
            }

            // Clean up old lastFrame and set the new one
            if (lastFrame) {
                lastFrame.close();
            }
            lastFrame = frame; // Ownership of the frame is transferred to be used in the next render cycle
            break;
        
        case 'clear':
             if (lastFrame) {
                lastFrame.close();
                lastFrame = null;
             }
             if(ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
             }
             break;
    }
};
