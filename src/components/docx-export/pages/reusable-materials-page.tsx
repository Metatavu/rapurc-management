import { Paragraph, TextRun, Document, HeadingLevel, TableRow, TableCell, Table, WidthType } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import PageLayout from "../helpers/page-layout";
import strings from "localization/strings";
import DocumentTableStyles from "../styles/document-table-styles";
import LocalizationUtils from "utils/localization-utils";
import ImageUtils from "../helpers/image-utils";

/**
 * Reusable Materials Page
 * 
 * @returns array of docx elements
 */
const reusableMaterialsPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary, localization: string) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const dividerPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(strings.docx.page3.title)
      ],
      heading: HeadingLevel.HEADING_2,
      style: "Title"
    }),
    dividerPar
  );

  pageChildren.push(dividerPar);

  const { reusables, reusableMaterials } = surveySummary;

  // Initialize reusable materials image attachment collection
  const imageAttachmentCollection = await ImageUtils.getSurveySummaryReusableAttachmentsCollection(doc, reusables);

  reusables.forEach((reusable, index) => {
    const localReusableMaterialsTableRows: TableRow[] = [];
    // Get reusable specific images
    const reusableImages = imageAttachmentCollection[index];

    const materialObject = reusableMaterials.find(reusableMaterial => reusableMaterial.id === reusable.reusableMaterialId);
    const materialName = materialObject && LocalizationUtils.getLocalizedName(materialObject.localizedNames, localization);
    const materialUsability = LocalizationUtils.getLocalizedUsability(reusable.usability);
    const materialAmount = `${reusable.amount} ${reusable.unit ? LocalizationUtils.getLocalizedUnits(reusable.unit) : ""}`;

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
    const reusableMaterialHeaderRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${materialName || ""}`,
                  bold: true
                })
              ],
              heading: HeadingLevel.HEADING_5
            })
          ],
          columnSpan: 4,
          borders: DocumentTableStyles.noBorders
        })
      ],
      tableHeader: true
    });

    const reusableMaterialsRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.reusables.dataGridColumns.usability}:`,
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
              text: materialUsability
            })
          ],
          borders: DocumentTableStyles.noBorders
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.reusables.dataGridColumns.buildingPart}:`,
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
              text: reusable.componentName
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const reusableMaterialAmountRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.reusables.dataGridColumns.amount}:`,
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
              text: materialAmount
            })
          ],
          borders: DocumentTableStyles.noBorders
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.reusables.dataGridColumns.wasteAmountInTons}:`,
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
              text: `${reusable.amountAsWaste || ""}`
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const reusableMaterialDescriptionRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.reusables.dataGridColumns.description}:`,
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
              text: reusable.description
            })
          ],
          columnSpan: 3,
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    localReusableMaterialsTableRows.push(reusableMaterialHeaderRow);
    localReusableMaterialsTableRows.push(dividerTableRow);
    localReusableMaterialsTableRows.push(reusableMaterialsRow);
    localReusableMaterialsTableRows.push(reusableMaterialAmountRow);
    localReusableMaterialsTableRows.push(dividerTableRow);
    localReusableMaterialsTableRows.push(reusableMaterialDescriptionRow);

    pageChildren.push(
      new Table({
        rows: [
          ...localReusableMaterialsTableRows
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        }
      })
    );

    pageChildren.push(dividerPar);

    pageChildren.push(
      new Paragraph({
        children: reusableImages
      })
    );
  });

  // Here we push our table to the page children
  // pageChildren.push(
  //   new Table({
  //     rows: reusableMaterialsTableRows,
  //     width: {
  //       size: 100,
  //       type: WidthType.PERCENTAGE
  //     }
  //   })
  // );

  // const images = await ImageUtils.getSurveySummaryReusableImageAttachments(doc, reusables[0].images!);
  // console.log("Images are ", images);
  // pageChildren.push(
  //   new Paragraph({
  //     children: [
  //       ...images
  //     ]
  //   })
  // );

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

export default reusableMaterialsPage;