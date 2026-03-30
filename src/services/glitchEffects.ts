// A collection of more advanced and creative glitch effect algorithms.
// Designed to be used in a Web Worker with OffscreenCanvas.

const rand = (max: number) => Math.random() * max;
const randInt = (max: number) => Math.floor(Math.random() * max);

export const applyAdvancedRGB = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    const offset = intensity * 30;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(frame, rand(offset) - offset / 2, rand(offset) - offset / 2);
    ctx.globalCompositeOperation = 'source-over';
};

export const applySliceDrift = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    for (let i = 0; i < 1 + intensity * 10; i++) {
        const y = rand(height);
        const h = 1 + rand(height / 10);
        const x = (rand(100) - 50) * intensity;
        ctx.drawImage(frame, 0, y, width, h, x, y, width, h);
    }
};

export const applyStaticNoise = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const amount = intensity * 60;
    for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < intensity) {
            const noise = (Math.random() - 0.5) * amount;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

export const applyRollingBars = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    const barHeight = height / (1 + intensity * 20);
    const scroll = performance.now() * 0.1 * (1 + intensity * 5);
    for (let y = 0; y < height; y += barHeight * 2) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.05 * intensity})`;
        ctx.fillRect(0, (y + scroll) % height, width, barHeight);
    }
};

export const applyDataMosh = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (!lastFrame || intensity === 0) return;
    if (Math.random() > 0.1) { // Moshing doesn't happen every frame
      ctx.drawImage(frame, 0, 0);
      return;
    }
    const blockHeight = Math.max(1, Math.floor(height / (15 / intensity)));
    for (let y = 0; y < height; y += blockHeight) {
        const source = Math.random() > 0.5 ? frame : lastFrame;
        const shift = (rand(2) - 1) * intensity * 50;
        ctx.drawImage(source, 0, y, width, blockHeight, shift, y, width, blockHeight);
    }
};

export const applyInversion = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    if (Math.random() < intensity) {
        ctx.globalCompositeOperation = 'difference';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
    }
};

export const applyFlicker = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    if (Math.random() < intensity * 0.5) {
        ctx.globalAlpha = 0.5 + Math.random() * 0.5;
        ctx.fillStyle = Math.random() > 0.5 ? 'white' : 'black';
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1.0;
    }
};

export const applyPixelSort = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (intensity === 0) return;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const threshold = 50 + (1 - intensity) * 200;

    for(let y = 0; y < height; y += 4) {
      for(let x = 0; x < width; x++) {
        const startIdx = (y * width + x) * 4;
        const brightness = (data[startIdx] + data[startIdx+1] + data[startIdx+2]) / 3;
        if(brightness > threshold) {
          const sortLength = randInt(Math.floor((width - x) * intensity * 0.2));
          const pixels = [];
          for(let i = 0; i < sortLength; i++) {
            if (x + i < width) {
                const idx = (y * width + (x + i)) * 4;
                pixels.push({ r: data[idx], g: data[idx+1], b: data[idx+2]});
            }
          }
          pixels.sort((a,b) => (a.r+a.g+a.b)/3 - (b.r+b.g+b.b)/3);
          for(let i = 0; i < sortLength; i++) {
            if (x + i < width) {
                const idx = (y * width + (x + i)) * 4;
                data[idx] = pixels[i].r;
                data[idx+1] = pixels[i].g;
                data[idx+2] = pixels[i].b;
            }
          }
           x += sortLength;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
};

export const applyQuantize = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    const levels = Math.round(2 + (1 - intensity) * 14);
    const step = 255 / (levels - 1);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(data[i] / step) * step;
        data[i + 1] = Math.round(data[i + 1] / step) * step;
        data[i + 2] = Math.round(data[i + 2] / step) * step;
    }
    ctx.putImageData(imageData, 0, 0);
};

export const applyWaveWarp = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    const amplitude = intensity * 25;
    const frequency = 0.05 + intensity * 0.1;
    const time = performance.now() * 0.002;
    for (let y = 0; y < height; y++) {
        const offsetX = Math.sin(y * frequency + time) * amplitude;
        ctx.drawImage(frame, 0, y, width, 1, offsetX, y, width, 1);
    }
};

export const applyChromaticAberration = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    const offset = intensity * 10;
    ctx.globalCompositeOperation = 'lighter';
    // Red channel
    ctx.drawImage(frame, offset, 0);
    // Green channel (sort of)
    ctx.drawImage(frame, -offset, 0);
    ctx.globalCompositeOperation = 'source-over';
};

export const applyBadSignal = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    applyStaticNoise(ctx, frame, lastFrame, width, height, intensity * 0.3);
    applyRollingBars(ctx, frame, lastFrame, width, height, intensity * 0.5);
    applyWaveWarp(ctx, frame, lastFrame, width, height, intensity * 0.1);
};

export const applySharpen = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    ctx.filter = `contrast(${1 + 0.5 * intensity}) brightness(${1 - 0.1 * intensity}) sharpen(${intensity})`;
    ctx.drawImage(frame, 0, 0);
    ctx.filter = 'none';
};

export const applyHoloEcho = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = intensity * 0.2;
    for (let i=0; i<3; i++) {
        const offset = (i * 10 + 5) * intensity;
        ctx.drawImage(frame, (Math.random()-0.5) * offset, (Math.random()-0.5) * offset);
    }
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    applyRollingBars(ctx, frame, lastFrame, width, height, intensity);
};

export const applyChannelShuffle = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    if (rand(1) < intensity) {
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            const randVal = rand(1);
            if (randVal < 0.33) { data[i] = g; data[i+1] = b; data[i+2] = r; }
            else if (randVal < 0.66) { data[i] = b; data[i+1] = r; data[i+2] = g; }
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

export const applyFeedbackLoop = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (!lastFrame) return;
    const scale = 1 + intensity * 0.05;
    const newW = width * scale;
    const newH = height * scale;
    ctx.globalAlpha = 0.9 - intensity * 0.2;
    ctx.drawImage(lastFrame, (width - newW) / 2, (height - newH) / 2, newW, newH);
    ctx.globalAlpha = 1.0;
    ctx.drawImage(frame, 0, 0);
};

export const applyTimeLag = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (!lastFrame) return;
    ctx.globalAlpha = 1 - intensity;
    ctx.drawImage(frame, 0, 0);
    ctx.globalAlpha = intensity;
    ctx.drawImage(lastFrame, 0, 0);
    ctx.globalAlpha = 1.0;
};

export const applyBlockNoise = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    const blockSize = 8 + intensity * 24;
    for (let i = 0; i < 20 * intensity; i++) {
        const x = randInt(width - blockSize);
        const y = randInt(height - blockSize);
        if (Math.random() > 0.5) {
            ctx.drawImage(frame, x, y, blockSize, blockSize, x + (rand(10) - 5), y + (rand(10) - 5), blockSize, blockSize);
        } else {
            ctx.fillStyle = `rgba(${randInt(255)}, ${randInt(255)}, ${randInt(255)}, ${rand(0.7)})`;
            ctx.fillRect(x, y, blockSize, blockSize);
        }
    }
};

export const applyLiquify = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const copy = new Uint8ClampedArray(imageData.data);
    const time = performance.now() * 0.001;
    const amplitude = intensity * 20;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const offsetX = Math.sin(y * 0.1 + time) * amplitude;
            const offsetY = Math.cos(x * 0.1 + time) * amplitude;
            const srcX = Math.round(x + offsetX);
            const srcY = Math.round(y + offsetY);

            if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
                const dstIdx = (y * width + x) * 4;
                const srcIdx = (srcY * width + srcX) * 4;
                imageData.data[dstIdx] = copy[srcIdx];
                imageData.data[dstIdx+1] = copy[srcIdx+1];
                imageData.data[dstIdx+2] = copy[srcIdx+2];
                imageData.data[dstIdx+3] = copy[srcIdx+3];
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

export const applyFlow = (ctx: OffscreenCanvasRenderingContext2D, frame: ImageBitmap, lastFrame: ImageBitmap | null, width: number, height: number, intensity: number): void => {
    if (!lastFrame) return;
    const tempCanvas = new OffscreenCanvas(width, height);
    const tempCtx = tempCanvas.getContext('2d')!;

    tempCtx.drawImage(lastFrame, 0, 0);
    const lastImageData = tempCtx.getImageData(0, 0, width, height);

    ctx.drawImage(frame, 0, 0);
    const currentImageData = ctx.getImageData(0, 0, width, height);

    for (let i = 0; i < currentImageData.data.length; i+=4) {
        if (Math.random() < intensity) {
            currentImageData.data[i] = lastImageData.data[i];
            currentImageData.data[i+1] = lastImageData.data[i+1];
            currentImageData.data[i+2] = lastImageData.data[i+2];
        }
    }
    ctx.putImageData(currentImageData, 0, 0);
};