import { Document, Packer } from "docx";
import documentStyles from "./styles/document-styles";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import strings from "localization/strings";

import demolitionInformationPage from "./pages/demolition-information-page";
import ownerAndBuildingInfoPage from "./pages/owner-and-building-info-page";
import reusableMaterialsPage from "./pages/reusable-materials-page";
import hazardousMaterialsPage from "./pages/hazardous-materials-page";
import wasteMaterialsPage from "./pages/waste-materials-page";

namespace DocxExportUtils {

  const pageFunctions = [
    demolitionInformationPage,
    ownerAndBuildingInfoPage,
    reusableMaterialsPage,
    wasteMaterialsPage,
    hazardousMaterialsPage
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
  const clientDocDownload = async (doc: Document, survey: SurveySummary) => {
    const docBlob = await Packer.toBlob(doc);
    const csvURL = window.URL.createObjectURL(docBlob);
    const tempLink = document.createElement("a");
    const surveyName = survey.building?.propertyName;

    tempLink.href = csvURL;
    tempLink.setAttribute("download", `${surveyName ?? strings.docx.metadata.unnamed}.docx`);
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

    clientDocDownload(doc, surveySummary);
  };
}

export default DocxExportUtils;