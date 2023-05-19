import { Paragraph, TextRun, Table, TableRow, TableCell, Document, WidthType, AlignmentType, HeadingLevel } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import PageLayout from "../helpers/page-layout";
import strings from "localization/strings";
import moment from "moment";
import LocalizationUtils from "utils/localization-utils";
import DocumentTableStyles from "../styles/document-table-styles";

/**
 * Demolition Information Page
 * 
 * @returns array of docx elements
 */
const demolitionInformationPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const dividerPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: strings.docx.page1.title
        })
      ],
      heading: HeadingLevel.HEADING_2,
      style: "Title"
    }),
    dividerPar
  );

  const surveyInfoTableRows: TableRow[] = [];

  // Property name row
  const propertyNameRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${strings.surveysScreen.dataGridColumns.propertyName}:`,
                bold: true
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary.building ? surveySummary.building.propertyName : ""}`
              })
            ],
            alignment: AlignmentType.RIGHT
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Demolition scope row
  const scopeRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${strings.survey.info.demolitionScope}:`,
                bold: true
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: LocalizationUtils.getLocalizedDemolitionScope(survey.type)
              })
            ],
            alignment: AlignmentType.RIGHT
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Demolition start date row
  const startDateRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${strings.survey.info.startDate}:`,
                bold: true
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${survey.startDate ? moment(survey.startDate).format("DD.MM.YYYY") : strings.survey.info.dateUnknown}`
              })
            ],
            alignment: AlignmentType.RIGHT
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Usage end date row
  const endDateRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${strings.survey.info.endDate}:`,
                bold: true
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${survey.endDate ? moment(survey.endDate).format("DD.MM.YYYY") : strings.survey.info.dateUnknown}`
              })
            ],
            alignment: AlignmentType.RIGHT
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Assemble the table rows
  surveyInfoTableRows.push(propertyNameRow);
  surveyInfoTableRows.push(scopeRow);
  surveyInfoTableRows.push(startDateRow);
  surveyInfoTableRows.push(endDateRow);

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: surveyInfoTableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
    })
  );

  pageChildren.push(dividerPar);
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${strings.survey.info.surveyors}:`
        })
      ],
      style: "normalPara"
    })
  );

  const { surveyors } = surveySummary;

  const surveyorsTableRows: TableRow[] = [];

  surveyors.forEach(surveyor => {
    const dividerTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: "",
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });
    const surveyorsTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: surveyor.role,
              style: "Normal"
            }),
            new Paragraph({
              text: `${surveyor.firstName} ${surveyor.lastName}`,
              style: "Normal"
            }),
            new Paragraph({
              text: surveyor.company,
              style: "Normal"
            }),
            new Paragraph({
              text: surveyor.email,
              style: "Normal"
            }),
            new Paragraph({
              text: surveyor.phone,
              style: "Normal"
            }),
            new Paragraph({
              text: `${strings.survey.info.dataGridColumns.visits}: ${surveyor.visits}`,
              style: "Normal"
            }),
            new Paragraph({
              text: `${strings.survey.info.dataGridColumns.reportDate}: ${moment(surveyor.reportDate).format("DD.MM.YYYY")}`,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });
    surveyorsTableRows.push(surveyorsTableRow);
    surveyorsTableRows.push(dividerTableRow);
  });

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: surveyorsTableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
    })
  );

  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${strings.survey.info.additionalInformation}:`
        })
      ],
      style: "normalPara"
    }),
    new Paragraph({
      text: survey.additionalInformation,
      style: "Normal"
    }),
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

export default demolitionInformationPage;