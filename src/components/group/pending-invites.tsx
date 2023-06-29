import { Box, Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SendIcon from "@mui/icons-material/Send";
import { GroupJoinInvite } from "generated/client";
import strings from "localization/strings";
import React, { FC, useMemo } from "react";
import { useAppSelector } from "app/hooks";
import { selectLanguage } from "features/locale-slice";

/**
 * Component properties
 */
interface Props {
  pendingInvites: GroupJoinInvite[];
}

/**
 * Component for pending invites
 *
 * @param props component properties
 */
const PendingInvites: FC<Props> = ({ pendingInvites }) => {
  const language = useAppSelector(selectLanguage);

  const columns: GridColDef[] = useMemo(() => [
    {
      field: "email",
      headerName: strings.groupManagementScreen.groupMembersScreen.email,
      flex: 1,
      renderCell: ({ value, row }) => (
        <Box>
          <span>
            { value }
          </span>
          <Button
            variant="text"
            endIcon={ <SendIcon/> }
            // TODO: Resend invitation logic
            onClick={ () => console.log(row)}
            sx={{ color: "#009E9E" }}
          >
            { strings.groupManagementScreen.pendingInvitesScreen.resend }
          </Button>
        </Box>
      )
    }
  ], [language]);

  return (
    <Paper>
      <DataGrid
        autoHeight
        rows={ pendingInvites }
        columns={ columns }
        pageSize={ 10 }
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default PendingInvites;