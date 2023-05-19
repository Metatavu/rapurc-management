import { Paragraph, TextRun, Header, Footer, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx";
import { Survey } from "generated/client";
import pageNumber from "./page-number";
import strings from "localization/strings";
import moment from "moment";
import DocumentTableStyles from "../styles/document-table-styles";

namespace PageLayout {
  /**
   * Returns document header
   * 
   * @param survey survey
   */
  export const getHeader = (survey: Survey) => {
    const tableRows: TableRow[] = [];
    const tableRow = new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.docx.metadata.title}`
                })
              ],
              style: "normalPara",
              alignment: AlignmentType.LEFT
            })
          ],
          borders: DocumentTableStyles.noBorders
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.docx.metadata.modified}: ${moment(survey.metadata.modifiedAt).format("DD.MM.YYYY") ?? ""}`
                })
              ],
              alignment: AlignmentType.RIGHT
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.docx.metadata.ready}: ${moment(survey.markedAsDone).format("DD.MM.YYYY") ?? ""}`
                })
              ],
              alignment: AlignmentType.RIGHT
            }),
            // TODO: fetch the creator name
            new Paragraph({
              children: [
                new TextRun({
                  text: `${strings.docx.metadata.creator}: ${survey.metadata.creatorId ?? ""}`
                })
              ],
              alignment: AlignmentType.RIGHT
            })
          ],
          borders: DocumentTableStyles.noBorders
        })
      ]
    });

    tableRows.push(tableRow);

    return new Header({
      children: [
        new Table({
          rows: tableRows,
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          }
        })
      ]
    });
  };

  /**
   * Returns document footer
   */
  export const getFooter = () => {
    return new Footer({
      children: [
        new Paragraph({
          text: ""
        }),
        pageNumber
      ]
    });
  };
}

export default PageLayout;