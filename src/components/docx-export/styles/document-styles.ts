import { AlignmentType, TabStopPosition, UnderlineType } from "docx";

const documentStyles = {
  styles: {
    default: {
      heading1: {
        run: {
          font: "Calibri",
          size: 52,
          bold: true,
          color: "000000",
          underline: {
            type: UnderlineType.SINGLE,
            color: "000000"
          }
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: { line: 340 }
        }
      },
      heading2: {
        run: {
          font: "Calibri",
          size: 26,
          bold: true
        },
        paragraph: {
          spacing: { line: 340 }
        }
      },
      heading3: {
        run: {
          font: "Calibri",
          size: 26,
          bold: true
        },
        paragraph: {
          spacing: { line: 276 }
        }
      },
      heading4: {
        run: {
          font: "Calibri",
          size: 26,
          bold: true
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED
        }
      }
    },
    paragraphStyles: [
      {
        id: "headingPara",
        name: "Heading Para",
        basedOn: "Heading",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "Arial",
          size: 48,
          bold: true
        },
        paragraph: {
          spacing: {
            line: 276,
            before: 20 * 72 * 0.1,
            after: 20 * 72 * 0.05
          },
          rightTabStop: TabStopPosition.MAX,
          leftTabStop: 453.543307087
        }
      },
      {
        id: "normalPara",
        name: "Normal Para",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "Calibri",
          size: 26,
          bold: true
        },
        paragraph: {
          spacing: {
            line: 276,
            before: 20 * 72 * 0.1,
            after: 20 * 72 * 0.05
          },
          rightTabStop: TabStopPosition.MAX,
          leftTabStop: 453.543307087
        }
      },
      {
        id: "tableHeader",
        name: "Normal Para2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "Calibri",
          size: 26
        },
        paragraph: {
          alignment: AlignmentType.JUSTIFIED,
          spacing: {
            line: 276,
            before: 20 * 72 * 0.1,
            after: 20 * 72 * 0.05
          }
        }
      },
      {
        id: "aside",
        name: "Aside",
        basedOn: "Normal",
        next: "Normal",
        run: {
          color: "999999",
          italics: true
        },
        paragraph: {
          spacing: { line: 276 },
          indent: { left: 200 }
        }
      },
      {
        id: "wellSpaced",
        name: "Well Spaced",
        basedOn: "Normal",
        paragraph: {
          spacing: {
            line: 276,
            before: 20 * 72 * 0.1,
            after: 20 * 72 * 0.05
          }
        }
      },
      {
        id: "numberedPara",
        name: "Numbered Para",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "Calibri",
          size: 26,
          bold: true
        },
        paragraph: {
          spacing: {
            line: 276,
            before: 20 * 72 * 0.1,
            after: 20 * 72 * 0.05
          },
          rightTabStop: TabStopPosition.MAX,
          leftTabStop: 453.543307087,
          numbering: {
            reference: "ref1",
            instance: 0,
            level: 0
          }
        }
      }
    ]
  }
};

export default documentStyles;