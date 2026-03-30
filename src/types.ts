export interface GlitchEffect {
    id: string;
    name: string;
    active: boolean;
    intensity: number; // A value from 0 to 1
    apply: (
        ctx: OffscreenCanvasRenderingContext2D,
        frame: ImageBitmap,
        lastFrame: ImageBitmap | null,
        width: number,
        height: number,
        intensity: number
    ) => void;
}
