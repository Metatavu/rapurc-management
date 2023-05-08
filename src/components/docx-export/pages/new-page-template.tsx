import { Paragraph, TextRun, Document } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import PageLayout from "../helpers/page-layout";

/**
 * Demolition Information Page
 * 
 * @returns array of docx elements
 */
const emptyPageTemplate = async (doc: Document, survey: Survey, surveySummary: SurveySummary) => {
  const pageChildren = [];

  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun("Empty page template")
      ],
      style: "Title"
    })
  );

  doc.addSection({
    properties: {},
    headers: {
      default: PageLayout.getHeader(survey, surveySummary)
    },
    footers: {
      default: PageLayout.getFooter()
    },
    children: pageChildren
  });
};

export default emptyPageTemplate;