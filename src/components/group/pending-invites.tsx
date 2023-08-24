import { Box, Button, CircularProgress, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SendIcon from "@mui/icons-material/Send";
import { GroupJoinInvite } from "generated/client";
import strings from "localization/strings";
import React, { FC, useContext, useMemo, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectLanguage } from "features/locale-slice";
import { selectKeycloak } from "features/auth-slice";
import { ErrorContext } from "components/error-handler/error-handler";
import { useParams } from "react-router-dom";
import Api from "api";

/**
 * Component properties
 */
interface Props {
  pendingInvites: GroupJoinInvite[];
  deletePendingInvite: (inviteId: string) => Promise<void>;
}

/**
 * Component for pending invites
 *
 * @param props component properties
 */
const PendingInvites: FC<Props> = ({ pendingInvites, deletePendingInvite }) => {
  const keycloak = useAppSelector(selectKeycloak);
  const language = useAppSelector(selectLanguage);
  const errorContext = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);
  const { groupId } = useParams();

  /**
   * Resends a group invite
   */
  const resendGroupInvite = async (groupJoinInvite: GroupJoinInvite) => {
    if (!keycloak?.token || !groupId || !groupJoinInvite.id) return;

    setLoading(true);
    try {
      await Api.getGroupJoinInvitesApi(keycloak.token).sendGroupJoinInviteEmail({
        groupId: groupJoinInvite.groupId,
        inviteId: groupJoinInvite.id
      });
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.inviteMember);
    }
    setLoading(false);
  };

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
            onClick={ () => resendGroupInvite(row)}
            sx={{ color: "#009E9E" }}
          >
            { strings.groupManagementScreen.pendingInvitesScreen.resend }
          </Button>
        </Box>
      )
    },
    {
      field: "control",
      headerName: "",
      width: 150,
      renderCell: ({ row }) => (
        <Box>
          <Button
            variant="contained"
            color="error"
            onClick={ () => deletePendingInvite(row.id)}
          >
            { strings.groupManagementScreen.pendingInvitesScreen.cancel }
          </Button>
        </Box>
      )
    }
  ], [language]);

  if (loading) {
    return (
      <Box
        display="flex"
        flex={ 1 }
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="inherit" size={ 60 }/>
      </Box>
    );
  }

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