import { Paragraph, TextRun, Table, TableRow, TableCell, Document, WidthType } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import ImageUtils from "../helpers/image-utils";
import PageLayout from "../helpers/page-layout";

/**
 * Demolition Information Page
 * 
 * @returns array of docx elements
 */
const imagesAndTablesPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const deviderPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun("Images and tables page")
      ],
      // We can use our custom styles like this:
      style: "headingPara"
      // Also we can use default Words styles like this:
      // style: "Title"
    })
  );

  const images = await ImageUtils.getSurveySummaryImageAttachments(doc, surveySummary.attachments);

  pageChildren.push(
    new Paragraph({
      children: [
        ...images
      ]
    })
  );

  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(`${survey.startDate} - ${survey.endDate}`)
      ],
      style: "normalPara"
    })
  );

  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(`${surveySummary.surveyors[0]}`)
      ],
      style: "normalPara"
    })
  );

  // Table below is created row by row
  const exampleTableRows = [];

  const tableHeaderRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: "Header 1",
            style: "tableHeader"
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: "Header 2",
            style: "tableHeader"
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: "Header 3",
            style: "tableHeader"
          })
        ]
      })
    ],
    tableHeader: true
  });
  exampleTableRows.push(tableHeaderRow);

  const tableValuesRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: "Value 1",
            style: "Normal"
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: "Value 2",
            style: "Normal"
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: "Value 3",
            style: "Normal"
          })
        ]
      })
    ],
    tableHeader: true
  });
  exampleTableRows.push(tableValuesRow);

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: exampleTableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
    })
  );
  pageChildren.push(deviderPar);

  pageChildren.push(
    new Paragraph({
      children: [
        ...images
      ]
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

export default imagesAndTablesPage;