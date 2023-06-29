import { Box, Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GroupJoinRequest } from "generated/client";
import strings from "localization/strings";
import React, { FC } from "react";

/**
 * Component properties
 */
interface Props {
  pendingRequests: GroupJoinRequest[];
}

// TODO: NEed to test requests from API
/**
 * Component for pending requests
 */
const PendingRequests: FC<Props> = ({ pendingRequests }) => {
  /**
   * Render pending invites data table
   */
  const renderPendingRequestsDataTable = () => {
    const columns: GridColDef[] = [
      {
        field: "name",
        headerName: strings.groupManagementScreen.groupMembersScreen.name,
        flex: 1
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
              // TODO: Reject request logic
              onClick={ () => console.log(row)}
            >
              { strings.groupManagementScreen.pendingRequestsScreen.reject }
            </Button>
            <Button
              color="primary"
              // TODO: Accept request logic
              onClick={ () => console.log(row)}
            >
              { strings.groupManagementScreen.pendingRequestsScreen.accept }
            </Button>
          </Box>
        )
      }
    ];

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

  return (
    <>
      { renderPendingRequestsDataTable() }
    </>
  );
};

export default PendingRequests;