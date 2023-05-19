import { Paragraph, TextRun, Table, TableRow, TableCell, Document, WidthType, HeadingLevel } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import PageLayout from "../helpers/page-layout";
import strings from "localization/strings";
import LocalizationUtils from "utils/localization-utils";
import DocumentTableStyles from "../styles/document-table-styles";

/**
 * Hazardous materials Page
 * 
 * @returns array of docx elements
 */
const hazardousMaterialsPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary, localization: string) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const dividerPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(strings.docx.page5.title)
      ],
      heading: HeadingLevel.HEADING_2,
      style: "Title"
    }),
    dividerPar
  );

  pageChildren.push(dividerPar);

  const hazardousMaterialsTableRows: TableRow[] = [];
  const { hazardousWastes, hazardousMaterials, wasteCategories, wasteSpecifiers } = surveySummary;

  hazardousWastes.forEach(hazardousWaste => {
    const wasteMaterial = hazardousMaterials.find(material => material.id === hazardousWaste.hazardousMaterialId);
    const wasteCategory = wasteCategories.find(category => category.id === wasteMaterial?.wasteCategoryId);
    const fullEwcCode = wasteMaterial ? `${wasteCategory?.ewcCode || ""}${wasteMaterial?.ewcSpecificationCode}` : "";
    const wasteSpecifierName = wasteSpecifiers
      .find(wasteSpecifier => wasteSpecifier.id === hazardousWaste.wasteSpecifierId)?.localizedNames
      .find(name => name.language === localization)?.value;
    const wasteAmount = `${hazardousWaste?.amount || ""}`;

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

    const hazardousMaterialTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.hazardousMaterial.dataGridColumns.material}:`,
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

    const hazardousSpecifierTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.hazardousMaterial.dataGridColumns.wasteSpecifier}:`,
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
              text: wasteSpecifierName,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    const hazardousWasteCodeTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.hazardousMaterial.dataGridColumns.wasteCode}:`,
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

    const hazardousWasteAmountTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.survey.hazardousMaterial.dataGridColumns.amountInTons}:`,
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

    const hazardousWasteAdditionalInformationTableRow = new TableRow({
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
              text: hazardousWaste.description,
              style: "Normal"
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    hazardousMaterialsTableRows.push(hazardousMaterialTableRow);
    hazardousMaterialsTableRows.push(hazardousSpecifierTableRow);
    hazardousMaterialsTableRows.push(hazardousWasteCodeTableRow);
    hazardousMaterialsTableRows.push(hazardousWasteAmountTableRow);
    hazardousMaterialsTableRows.push(hazardousWasteAdditionalInformationTableRow);
    hazardousMaterialsTableRows.push(dividerTableRow);
  });

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: hazardousMaterialsTableRows,
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

export default hazardousMaterialsPage;