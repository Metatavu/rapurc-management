import { Box, Button, CircularProgress, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Api from "api";
import { useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import { selectKeycloak } from "features/auth-slice";
import { selectLanguage } from "features/locale-slice";
import { GroupJoinRequest, JoinRequestStatus } from "generated/client";
import strings from "localization/strings";
import React, { Dispatch, FC, SetStateAction, useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

/**
 * Component properties
 */
interface Props {
  pendingRequests: GroupJoinRequest[];
  setPendingRequests: Dispatch<SetStateAction<GroupJoinRequest[]>>;
}

/**
 * Component for pending requests
 *
 * @params props component properties
 */
const PendingRequests: FC<Props> = ({ pendingRequests, setPendingRequests }) => {
  const keycloak = useAppSelector(selectKeycloak);
  const language = useAppSelector(selectLanguage);
  const errorContext = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);
  const { groupId } = useParams();

  /**
   * Accepts or rejects pending request
   *
   * @param groupJoinRequest GroupJoinRequest
   * @param status JoinRequestStatus
   */
  const updatePendingRequest = async (groupJoinRequest: GroupJoinRequest, status: JoinRequestStatus) => {
    if (!keycloak?.token || !groupId || !groupJoinRequest.id) {
      return;
    }

    setLoading(true);
    try {
      const updatedRequestResponse = await Api.getGroupJoinRequestsApi(keycloak.token).updateGroupJoinRequest({
        groupId: groupId,
        requestId: groupJoinRequest.id,
        groupJoinRequest: {
          ...groupJoinRequest,
          status: status
        }
      });

      const updatedRequests = pendingRequests.filter(request => request.id !== updatedRequestResponse.id);
      setPendingRequests(updatedRequests);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.pendingRequests);
    }
    setLoading(false);
  };

  const columns: GridColDef[] = useMemo(() => [
    {
      field: "name",
      headerName: strings.groupManagementScreen.groupMembersScreen.name,
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          {`${row.firstName} ${row.lastName}`}
        </Box>
      )
    },
    {
      field: "email",
      headerName: strings.groupManagementScreen.groupMembersScreen.email,
      flex: 1
    },
    {
      field: "control",
      headerName: "",
      flex: 1,
      renderCell: ({ row }) => (
        <Box>
          <Button
            variant="outlined"
            color="primary"
            style={{ marginRight: 8 }}
            onClick={ () => updatePendingRequest(row, JoinRequestStatus.Rejected) }
          >
            { strings.groupManagementScreen.pendingRequestsScreen.reject }
          </Button>
          <Button
            color="primary"
            onClick={ () => updatePendingRequest(row, JoinRequestStatus.Accepted) }
          >
            { strings.groupManagementScreen.pendingRequestsScreen.accept }
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
        rows={ pendingRequests }
        columns={ columns }
        pageSize={ 10 }
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default PendingRequests;