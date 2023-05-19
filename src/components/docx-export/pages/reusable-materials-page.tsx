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

  // const reusableMaterialsTableRows: TableRow[] = [];
  const { reusables, reusableMaterials } = surveySummary;
  // const images = []:

  // reusables.map(reusable => {
  //   reusable.images
  // })

  // const pictureTest = await ImageUtils.getSurveySummaryReusableImageAttachment(doc, reusables[0].images![0]);

  reusables.forEach(async reusable => {
    const localReusableMaterialsTableRows: TableRow[] = [];
    // const images: Promise<PictureRun | undefined>[] = [];
    const materialObject = reusableMaterials.find(reusableMaterial => reusableMaterial.id === reusable.reusableMaterialId);
    const materialName = materialObject && LocalizationUtils.getLocalizedName(materialObject.localizedNames, localization);
    const materialUsability = LocalizationUtils.getLocalizedUsability(reusable.usability);
    const materialAmount = `${reusable.amount} ${reusable.unit ? LocalizationUtils.getLocalizedUnits(reusable.unit) : ""}`;

    // if (reusable.images) {
    //   reusable.images.forEach(async image => {
    //     const reusableImage = ImageUtils.getSurveySummaryReusableImageAttachment(doc, image);
    //     reusableImage && images.push(reusableImage);
    //   });
    // }

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

    const image = await ImageUtils.getSurveySummaryReusableImageAttachment(doc, reusables[0].images![0]);

    localReusableMaterialsTableRows.push(reusableMaterialHeaderRow);
    localReusableMaterialsTableRows.push(dividerTableRow);
    localReusableMaterialsTableRows.push(reusableMaterialsRow);
    localReusableMaterialsTableRows.push(reusableMaterialAmountRow);
    localReusableMaterialsTableRows.push(dividerTableRow);
    localReusableMaterialsTableRows.push(reusableMaterialDescriptionRow);
    localReusableMaterialsTableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  image!
                ]
              })
            ],
            borders: DocumentTableStyles.noBorders
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: "Test"
              })
            ],
            columnSpan: 3,
            borders: DocumentTableStyles.noBorders
          })
        ]
      })
    );

    // localReusableMaterialsTableRows.push(reusableMaterialImageRow);
    // localReusableMaterialsTableRows.push(dividerTableRow);

    pageChildren.push(
      new Table({
        rows: [
          reusableMaterialHeaderRow,
          reusableMaterialsRow,
          reusableMaterialAmountRow,
          reusableMaterialDescriptionRow
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        }
      })
    );

    pageChildren.push(dividerPar);

    // const image = await ImageUtils.getSurveySummaryReusableImageAttachment(doc, reusables[0].images![0]);
    // if (image) {
    //   console.log("Images are ", image);
    //   pageChildren.push(
    //     new Paragraph({
    //       children: [
    //         image
    //       ]
    //     })
    //   );
    // }

    // if (reusable.images && reusable.images.length) {
    // const images = await ImageUtils.getSurveySummaryReusableImageAttachments(doc, reusable.images);
    // const images = await ImageUtils.getSurveySummaryReusableImageAttachments(doc, reusables[0].images!);
    // console.log("Images are ", images);
    // pageChildren.push(
    //   new Paragraph({
    //     children: [
    //       ...images
    //     ]
    //   })
    // );
    // }
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