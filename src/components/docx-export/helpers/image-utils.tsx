import { Document, Media, PictureRun } from "docx";
import { Attachment } from "generated/client";
// import Jimp from "jimp";

const allowedImageTypes = ["image/gif", "image/jpeg", "image/png"];

namespace ImageUtils {
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

    if (!allowedImageTypes.includes(blob.type)) {
      return null;
    }

    const dimensions = await getBlobImageDimensions(blob) as [number, number];
    const imageBuffer = await blob.arrayBuffer();

    return Media.addImage(doc, imageBuffer, dimensions[0], dimensions[1]);
  };

  /**
   * Get image attachments from survey summary
   * 
   * @param doc docx document
   * @param attachments survey summary attachments
   */
  export const getSurveySummaryImageAttachments = async (doc: Document, attachments: Attachment[]) => {
    const imageAttachments: Promise<PictureRun | null>[] = [];

    attachments.forEach(attachment => {
      const image = getDocxImage(doc, attachment.url);
      imageAttachments.push(image);
    });

    const imageAttachmentsUnfiltered = await Promise.all(imageAttachments);
    return imageAttachmentsUnfiltered.filter(image => image !== null) as PictureRun[];
  };
}

export default ImageUtils;