import { Document, Packer } from "docx";
import documentStyles from "./styles/document-styles";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import strings from "localization/strings";

import demolitionInformationPage from "./pages/demolition-information-page";
import imagesAndTablesPage from "./pages/images-and-tables-page";
import newPageTemplate from "./pages/new-page-template";

namespace DocxExportUtils {

  const pageFunctions = [
    demolitionInformationPage,
    imagesAndTablesPage,
    newPageTemplate
  ];

  /**
   * Unpack page functions
   * 
   * @param doc document
   */
  const unpackPageFunctions = async (doc: Document, survey: Survey, surveySummary: SurveySummary) => {
    const localization = strings.getLanguage();
    // eslint-disable-next-line no-restricted-syntax
    for (const pageFunction of pageFunctions) {
      // eslint-disable-next-line no-await-in-loop
      await pageFunction(doc, survey, surveySummary, localization);
    }
  };

  /**
   * Downlaod docx file to client's device
   * 
   * @param doc document
   */
  const clientDocDownload = async (doc: Document) => {
    const docBlob = await Packer.toBlob(doc);
    const csvURL = window.URL.createObjectURL(docBlob);
    const tempLink = document.createElement("a");

    tempLink.href = csvURL;
    tempLink.setAttribute("download", "filename.docx");
    tempLink.click();
  };

  /**
   * Generate docx file
   */
  export const generateDocx = async (survey: Survey, surveySummary: SurveySummary) => {
    const doc = new Document({
      title: "",
      styles: documentStyles.styles
    });

    await unpackPageFunctions(doc, survey, surveySummary);

    clientDocDownload(doc);
  };
}

export default DocxExportUtils;