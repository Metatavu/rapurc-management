import { FileCopy } from "@mui/icons-material";
import { Stack, Typography, Hidden } from "@mui/material";
import { Attachment } from "generated/client";
import * as React from "react";
import { AttachmentContainer } from "styled/screens/surveys-screen";

/**
 * Component properties
 */
interface Props {
  attachment: Attachment;
  rightControl: JSX.Element;
  onClick?: () => void;
}

/**
 * Attachment card component
 *
 * @param props component properties
 */
const AttachmentCard: React.FC<Props> = ({
  attachment,
  onClick,
  rightControl
}) => {
  /**
   * Component render
   */
  return (
    <AttachmentContainer
      direction="row"
      justifyContent="space-between"
      onClick={ onClick }
      sx={{ backgroundColor: "#fff" }}
    >
      <Stack
        direction="row"
        spacing={ 3 }
      >
        <Hidden lgDown>
          <FileCopy htmlColor="rgba(0,0,0,0.54)"/>
        </Hidden>
        <Typography>
          { attachment.name }
        </Typography>
      </Stack>
      { rightControl }
    </AttachmentContainer>
  );
};

export default AttachmentCard;