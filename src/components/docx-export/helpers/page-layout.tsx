import { Paragraph, TextRun, Header, Footer } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import pageNumber from "./page-number";

namespace PageLayout {
  // Break text run is used to create line break
  const breakText = new TextRun({ text: "" }).tab();

  /**
   * Returns document header
   * 
   * @param survey survey
   * @param surveySummary survey summary
   */
  export const getHeader = (survey: Survey, surveySummary: SurveySummary) => {
    return new Header({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `Author: ${surveySummary.ownerInformation?.ownerName ?? ""}`
            }),
            breakText,
            new TextRun({
              text: `Building address: ${surveySummary.building?.address?.streetAddress ?? ""}`
            })
          ],
          style: "wellSpaced"
        }),
        new Paragraph({
          text: `Created: ${survey.metadata.createdAt?.toLocaleString() ?? ""}`
        }),
        new Paragraph({
          text: `Updated: ${survey.metadata.modifiedAt?.toLocaleString() ?? ""}`
        })
      ]
    });
  };

  /**
   * Returns document footer
   */
  export const getFooter = () => {
    return new Footer({
      children: [
        new Paragraph({
          text: ""
        }),
        pageNumber
      ]
    });
  };
}

export default PageLayout;