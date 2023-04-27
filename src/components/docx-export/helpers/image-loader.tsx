import path from 'path';
import Jimp from 'jimp';

namespace ImageLoader {
    /**
     * Get image fit coefficient
     * 
     * @param width image width
     * @param height image height
     * @param fitWidth image fit width
     * @param fitHeight image fit height
     * @returns 
     */
    const fitImage = (width: number, height: number, fitWidth: number, fitHeight: number) => {
        const fitRatio = fitWidth / fitHeight;
        const ratio = width / height;
        let newWidth = fitWidth;
        let newHeight = fitHeight;
        if (ratio > fitRatio) {
            newHeight = newWidth / ratio;
        } else {
            newWidth = newHeight * ratio;
        }
        return [newWidth, newHeight];
    };

    /**
     * Load image from file 
     *
     * @param filePath file path
     */
    export const load = async (filePath: string) => {
        const fullPath = path.resolve(filePath);
        const image = await Jimp.read(fullPath);

        return image;
    };

    /**
     * Get image fit size height and width
     * 
     * @param image image
     * @param fitWidth fit width
     * @param fitHeight fit height
     * @returns 
     */
    export const getFitSize = (image: Jimp, fitWidth: number, fitHeight: number) => {
        const width = image.bitmap.width;
        const height = image.bitmap.height;
        return fitImage(width, height, fitWidth, fitHeight);
    }

    /**
     * Get image buffer
     * 
     * @param image image
     */
    export const getBuffer = async (image: Jimp) => {
        const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
        return imageBuffer;
    }
}

export default ImageLoader;
