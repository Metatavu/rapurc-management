import { Paragraph, TextRun, Document } from "docx";
import { Survey } from "generated/client";
import PageLayout from "../helpers/page-layout";

/**
 * Demolition Information Page
 * 
 * @returns array of docx elements
 */
const emptyPageTemplate = async (doc: Document, survey: Survey) => {
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
      default: PageLayout.getHeader(survey)
    },
    footers: {
      default: PageLayout.getFooter()
    },
    children: pageChildren
  });
};

export default emptyPageTemplate;