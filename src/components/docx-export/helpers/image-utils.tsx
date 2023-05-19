import { Document, Media, PictureRun } from "docx";
import { Attachment, Reusable } from "generated/client";

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
   * Obtains a reusable image ...
   */
  export const getReusableImage = async (doc: Document, image: Blob) => {
    if (!allowedImageTypes.includes(image.type)) {
      return;
    }

    const imageBuffer = await image.arrayBuffer();

    return Media.addImage(doc, imageBuffer);
  };

  /**
   * Convert a base64 string to blob
   */
  const convertBase64ImageToBlob = (imageBase64: string) => {
    const byteCharacters = atob(imageBase64.split(",")[1]);
    const mimeString = imageBase64
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeString });

    return blob;
  };

  /**
   * Get Reusable objects image attachments from survey summary
   * 
   * @param doc docx document
   * @param attachments survey summary attachments
   */
  const getSurveySummaryReusableImageAttachments = async (doc: Document, images: string[]) => {
    let pictures: PictureRun[] = [];
    const imageAttachments: Promise<PictureRun | undefined>[] = [];

    images.forEach(image => {
      const blobImage = convertBase64ImageToBlob(image);
      const pictureRunImage = getReusableImage(doc, blobImage);

      imageAttachments.push(pictureRunImage);
    });

    const imageAttachmentsUnfiltered = await Promise.all(imageAttachments);

    pictures = imageAttachmentsUnfiltered.filter(image => image !== undefined) as PictureRun[];

    return pictures;
  };

  /**
   * Get attachments collection
   * 
   * @param doc docx document
   * @param attachments survey summary attachments
   * @returns 
   */
  export const getSurveySummaryReusableAttachmentsCollection = async (doc: Document, reusables: Reusable[]) => {
    const attachmentsCollection: Promise<PictureRun[]>[] = [];

    reusables.forEach(reusable => {
      if (reusable.images) {
        const images = getSurveySummaryReusableImageAttachments(doc, reusable.images);
        attachmentsCollection.push(images);
      } else {
        attachmentsCollection.push(Promise.resolve([]));
      }
    });

    const attachmentsCollectionUnfiltered = await Promise.all(attachmentsCollection);

    return attachmentsCollectionUnfiltered;
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