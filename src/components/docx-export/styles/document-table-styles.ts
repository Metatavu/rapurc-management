import { BorderStyle } from "docx";

namespace DocumentTableStyles {
  export const noBorders = {
    left: {
      style: BorderStyle.NIL,
      size: 0,
      color: "#000"
    },
    right: {
      style: BorderStyle.NIL,
      size: 0,
      color: "#000"
    },
    top: {
      style: BorderStyle.NIL,
      size: 0,
      color: "#000"
    },
    bottom: {
      style: BorderStyle.NIL,
      size: 0,
      color: "#000"
    }
  };
}

export default DocumentTableStyles;