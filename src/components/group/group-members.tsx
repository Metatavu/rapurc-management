import { Box, Button, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import React, { FC } from "react";
import strings from "localization/strings";
import { User } from "generated/client";

/**
 * Component properties
 */
interface Props {
  groupMembers: User[];
}

/**
 * Component for Group Members
 */
const GroupMembers: FC<Props> = ({ groupMembers }) => {
  /**
   * Render group member data table
   */
  const renderGroupMemberDataTable = () => {
    const columns: GridColDef[] = [
      {
        field: "name",
        headerName: strings.groupManagementScreen.groupMembersScreen.name,
        width: 150,
        renderCell: ({ row }) => (
          <Box>
            {`${row.firstName} ${row.lastName}`}
          </Box>
        )
      },
      {
        field: "email",
        headerName: strings.groupManagementScreen.groupMembersScreen.email,
        width: 200
      },
      {
        field: "role",
        headerName: strings.groupManagementScreen.groupMembersScreen.role,
        flex: 1
      },
      {
        field: "control",
        headerName: strings.groupManagementScreen.groupMembersScreen.control,
        flex: 1,
        renderCell: params => (
          <Box>
            <Button
              startIcon={ <AdminPanelSettingsIcon/> }
              disabled
              style={{ marginRight: 8 }}
              onClick={ () => console.log(params.row)}
            >
              { strings.groupManagementScreen.groupMembersScreen.role }
            </Button>
            <Button
              startIcon={ <PersonRemoveIcon/> }
              color="error"
              // TODO: delete user form group logic
              onClick={ () => console.log(params.row)}
            >
              { strings.generic.delete }
            </Button>
          </Box>
        )
      }
    ];

    return (
      <Paper>
        <DataGrid
          autoHeight
          rows={ groupMembers }
          columns={ columns }
          pageSize={ 10 }
          disableSelectionOnClick
          onRowClick={ () => {} }
        />
      </Paper>
    );
  };

  return (
    <>
      { renderGroupMemberDataTable() }
    </>
  );
};

export default GroupMembers;