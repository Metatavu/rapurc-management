import { Box, Button, CircularProgress, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import React, { Dispatch, FC, SetStateAction, useContext, useMemo, useState } from "react";
import strings from "localization/strings";
import { User } from "generated/client";
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
  groupMembers: User[];
  setGroupMembers: Dispatch<SetStateAction<User[]>>;
}

/**
 * Component for Group Members
 *
 * @param props component properties
 */
const GroupMembers: FC<Props> = ({ groupMembers, setGroupMembers }) => {
  const keycloak = useAppSelector(selectKeycloak);
  const language = useAppSelector(selectLanguage);
  const errorContext = useContext(ErrorContext);
  const [loading, setLoading] = useState(false);
  const { groupId } = useParams();

  // TODO: Need to test, but need another user to do so.
  /**
   * Deletes member from group
   *
   * @param member User
   */
  const deleteMemberFromGroup = async (member: User) => {
    if (!keycloak?.token || !groupId || !member.id) {
      return;
    }

    setLoading(true);
    try {
      await Api.getUserGroupsApi(keycloak.token).deleteGroupUser({
        groupId: groupId,
        userId: member.id
      });

      const updatedMembers = groupMembers.filter(m => m.id !== member.id);
      setGroupMembers(updatedMembers);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.deleteGroupMember);
    }
    setLoading(false);
  };

  const columns: GridColDef[] = useMemo(() => [
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
            // onClick={ ... }
          >
            { strings.groupManagementScreen.groupMembersScreen.role }
          </Button>
          <Button
            startIcon={ <PersonRemoveIcon/> }
            color="error"
            onClick={ () => deleteMemberFromGroup(params.row)}
          >
            { strings.generic.delete }
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
        rows={ groupMembers }
        columns={ columns }
        pageSize={ 10 }
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default GroupMembers;