import { Paragraph, TextRun, Document, HeadingLevel, TableRow, TableCell, Table, WidthType } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";
import PageLayout from "../helpers/page-layout";
import strings from "localization/strings";
import DocumentTableStyles from "../styles/document-table-styles";
import LocalizationUtils from "utils/localization-utils";

/**
 * Demolition Information Page
 * 
 * @returns array of docx elements
 */
const ownerAndBuildingInfoPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary, selectedLanguage: string) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const dividerPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(strings.docx.page2.title)
      ],
      heading: HeadingLevel.HEADING_2,
      style: "Title"
    }),
    dividerPar
  );

  const ownerInfoTableRows: TableRow[] = [];

  // Owner info header row
  const ownerInfoHeaderRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.docx.page2.ownerContactPerson,
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
                text: strings.docx.page2.ownerAndAddress,
                bold: true
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ],
    tableHeader: true
  });

  // Owner info row 
  const ownerInfoRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary?.ownerInformation?.contactPerson?.firstName || ""} ${surveySummary?.ownerInformation?.contactPerson?.lastName || ""}`
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary?.ownerInformation?.contactPerson?.profession || ""}`
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary?.ownerInformation?.contactPerson?.email || ""}`
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary?.ownerInformation?.contactPerson?.phone || ""}`
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
                text: `${surveySummary?.ownerInformation?.ownerName}`
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary?.building?.address?.streetAddress || ""}`
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${surveySummary?.building?.address?.postCode || ""} ${surveySummary?.building?.address?.city || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Assemble the table rows
  ownerInfoTableRows.push(ownerInfoHeaderRow);
  ownerInfoTableRows.push(ownerInfoRow);

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: ownerInfoTableRows,
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
          text: strings.docx.page2.buildingInfo
        })
      ],
      style: "normalPara"
    })
  );

  const buildingInfoTableRows: TableRow[] = [];

  // Building ID row 
  const buildingIDRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.newSurveyScreen.buildingId,
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
                text: `${surveySummary.building?.buildingId}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Property ID row 
  const propertyIDRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.newSurveyScreen.propertyId,
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
                text: `${surveySummary.building?.propertyId}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  const buildingTypeObject = surveySummary.buildingTypes.find(buildingType => buildingType.id === surveySummary.building?.buildingTypeId);
  const buildingTypeName = buildingTypeObject && LocalizationUtils.getLocalizedName(buildingTypeObject.localizedNames, selectedLanguage);

  // Building class row 
  const buildingClassRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.surveysScreen.dataGridColumns.classificationCode,
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
                text: `${buildingTypeName}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Construction year row 
  const constructionYearRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.year,
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
                text: `${surveySummary.building?.constructionYear || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Floor area row 
  const floorAreaRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.area,
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
                text: `${surveySummary.building?.space || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Volume row 
  const volumeRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.volume,
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
                text: `${surveySummary.building?.volume || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // floors row 
  const floorsRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.floors,
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
                text: `${surveySummary.building?.floors || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Basement floors row 
  const basementFloorsRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.basementFloors,
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
                text: `${surveySummary.building?.basements || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // foundation Material row 
  const foundationMaterialRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.foundationMaterial,
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
                text: `${surveySummary.building?.foundation || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // supporting Structure row 
  const supportingStructureRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.supportingStructure,
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
                text: `${surveySummary.building?.supportingStructure || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // façade Material row 
  const façadeMaterialRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.façadeMaterial,
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
                text: `${surveySummary.building?.facadeMaterial || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // roof Structure row 
  const roofStructure = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: strings.survey.building.roofStructure,
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
                text: `${surveySummary.building?.roofType || ""}`
              })
            ]
          })
        ],
        borders: DocumentTableStyles.noBorders
      })
    ]
  });

  // Assemble the table rows
  buildingInfoTableRows.push(buildingIDRow);
  buildingInfoTableRows.push(propertyIDRow);
  buildingInfoTableRows.push(buildingClassRow);
  buildingInfoTableRows.push(constructionYearRow);
  buildingInfoTableRows.push(floorAreaRow);
  buildingInfoTableRows.push(volumeRow);
  buildingInfoTableRows.push(floorsRow);
  buildingInfoTableRows.push(basementFloorsRow);
  buildingInfoTableRows.push(foundationMaterialRow);
  buildingInfoTableRows.push(supportingStructureRow);
  buildingInfoTableRows.push(façadeMaterialRow);
  buildingInfoTableRows.push(roofStructure);

  // Here we push our table to the page children
  pageChildren.push(
    new Table({
      rows: buildingInfoTableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
    })
  );

  if (surveySummary.building?.otherStructures) {
    pageChildren.push(
      dividerPar,
      new Paragraph({
        children: [
          new TextRun({
            text: strings.survey.otherStructures.title
          })
        ],
        style: "normalPara"
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: strings.survey.otherStructures.addedDescription
          })
        ]
      })
    );

    const { otherStructures } = surveySummary.building;

    if (otherStructures.length > 0) {
      const otherStructuresTableRows: TableRow[] = [];

      otherStructures.forEach(structure => {
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
        const otherStructuresTableRow = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: structure.name,
                  style: "Normal"
                })
              ],
              borders: DocumentTableStyles.noBorders
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: structure.description,
                  style: "Normal"
                })
              ],
              borders: DocumentTableStyles.noBorders
            })
          ]
        });
        otherStructuresTableRows.push(dividerTableRow);
        otherStructuresTableRows.push(otherStructuresTableRow);
        otherStructuresTableRows.push(dividerTableRow);
      });
      // Here we push our table to the page children
      pageChildren.push(
        new Table({
          rows: otherStructuresTableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          }
        })
      );
    }
  }

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

export default ownerAndBuildingInfoPage;