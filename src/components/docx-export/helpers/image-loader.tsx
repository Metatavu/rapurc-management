import { Document, Media } from "docx";
// import Jimp from "jimp";

namespace ImageLoader {
  /**
   * Get image blob dimensions
   * 
   * @param imageBlob image blob
   */
  const getBlobImageDimensions = async (imageBlob: Blob) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageBlob);
    const imageDimensions = await new Promise((resolve, reject) => {
      img.onload = () => {
        resolve([img.width, img.height]);
      };
      img.onerror = reject;
    });
    
    return imageDimensions;
  };

  /**
  * Gets image by url and converts it to buffer
  * 
  * @param url image url
  */
  const getImageBlobByUrl = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  };

  /**
   * Get docx image by url with original dimensions
   * 
   * @param doc docx document
   * @param url image url
   */
  export const getDocxImage = async (doc: Document, url: string) => {
    const blob = await getImageBlobByUrl(url);
    const dimensions = await getBlobImageDimensions(blob) as [number, number];
    const imageBuffer = await blob.arrayBuffer();

    return Media.addImage(doc, imageBuffer, dimensions[0], dimensions[1]);
  };
}

export default ImageLoader;