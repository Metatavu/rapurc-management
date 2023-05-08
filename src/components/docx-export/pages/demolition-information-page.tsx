import { Paragraph, TextRun, Table, TableRow, TableCell, Document, WidthType } from "docx";
import { Survey } from "generated/client";
import { SurveySummary } from "types";

/**
 * Demolition Information Page
 * 
 * @returns array of docx elements
 */
const demolitionInformationPage = async (doc: Document, survey: Survey, surveySummary: SurveySummary, localization: string) => {
  const pageChildren = [];

  // Divider paragraph is used to create space between elements (i.e between tables)
  const deviderPar = new Paragraph({ text: "", style: "general" });

  // Here we create a simple header text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun("Demolition Information Page")
      ],
      // We can use our custom styles like this:
      style: "headingPara"
      // Also we can use default Words styles like this:
      // style: "Title"
    })
  );

  // Here we create a simple text paragraph and add it to our array of children
  pageChildren.push(
    new Paragraph({
      children: [
        new TextRun(`Survey id: ${survey.id}`)
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

  const { hazardousMaterials } = surveySummary;

  const hazardousMaterialsTableRows = [];

  const hazardousMaterialsTableHeaderRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: "Id",
            style: "tableHeader"
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: "Name",
            style: "tableHeader"
          })
        ]
      }),
      new TableCell({
        children: [
          new Paragraph({
            text: "Specification code",
            style: "tableHeader"
          })
        ]
      })
    ],
    tableHeader: true
  });
  hazardousMaterialsTableRows.push(hazardousMaterialsTableHeaderRow);

  hazardousMaterials.forEach(hazardousMaterial => {
    const hazardousMaterialsTableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: hazardousMaterial.id,
              style: "Normal"
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: hazardousMaterial.localizedNames.find(localizedName => localizedName.language === localization)?.value,
              style: "Normal"
            })
          ]
        }),
        new TableCell({
          children: [
            new Paragraph({
              text: hazardousMaterial.ewcSpecificationCode,
              style: "Normal"
            })
          ]
        })
      ],
      tableHeader: true
    });
    hazardousMaterialsTableRows.push(hazardousMaterialsTableRow);
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
    children: pageChildren
  });
};

export default demolitionInformationPage;