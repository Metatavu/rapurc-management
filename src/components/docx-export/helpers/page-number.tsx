import { Paragraph, TextRun } from "docx";

const currentPageRun = new TextRun("").pageNumber();
const pageNumber = new Paragraph({
  children: [currentPageRun],
  style: "pagination"
});

export default pageNumber;