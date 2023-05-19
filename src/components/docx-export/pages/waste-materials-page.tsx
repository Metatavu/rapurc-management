import { Paragraph, TextRun, Table, TableRow, TableCell, Document, WidthType, HeadingLevel } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import PageLayout from "../helpers/page-layout";
import strings from "localization/strings";
import LocalizationUtils from "utils/localization-utils";
import DocumentTableStyles from "../styles/document-table-styles";

/**
 * Waste materials Page
 * 
 * @returns array of docx elements
 */
const wasteMaterialsPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary, localization: string) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const dividerPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(strings.docx.page4.title)
      ],
      heading: HeadingLevel.HEADING_2,
      style: "Title"
    }),
    dividerPar
  );

  pageChildren.push(dividerPar);

  const wasteMaterialsTableRows: TableRow[] = [];
  const { wastes, wasteCategories, wasteMaterials, usages } = surveySummary;

  wastes.forEach(waste => {
    const wasteMaterial = wasteMaterials.find(material => material.id === waste.wasteMaterialId);
    const wasteCategory = wasteCategories.find(category => category.id === wasteMaterial?.wasteCategoryId);
    const fullEwcCode = wasteCategory ? `${wasteCategory?.ewcCode || ""}${wasteMaterial?.ewcSpecificationCode}` : "";
    const wasteUsageObject = usages.find(usage => usage.id === waste.usageId);
    const wasteUsage = wasteUsageObject && LocalizationUtils.getLocalizedName(wasteUsageObject.localizedNames, localization);
    const wasteAmount = `${waste?.amount || ""}`;

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

    const wasteMaterialTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.wasteMaterial.dataGridColumns.material}:`,
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
              text: wasteMaterial && LocalizationUtils.getLocalizedName(wasteMaterial.localizedNames, localization),
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const wasteSpecifierTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.wasteMaterial.dataGridColumns.usage}:`,
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
              text: wasteUsage,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const wasteWasteCodeTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.wasteMaterial.dataGridColumns.wasteCode}:`,
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
              text: fullEwcCode,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const wasteWasteAmountTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.wasteMaterial.dataGridColumns.amountInTons}:`,
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
              text: wasteAmount,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const wasteWasteAdditionalInformationTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.reusables.dataGridColumns.description}`,
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
              text: waste.description,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    wasteMaterialsTableRows.push(wasteMaterialTableRow);
    wasteMaterialsTableRows.push(wasteSpecifierTableRow);
    wasteMaterialsTableRows.push(wasteWasteCodeTableRow);
    wasteMaterialsTableRows.push(wasteWasteAmountTableRow);
    wasteMaterialsTableRows.push(wasteWasteAdditionalInformationTableRow);
    wasteMaterialsTableRows.push(dividerTableRow);
  });

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: wasteMaterialsTableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
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

export default wasteMaterialsPage;