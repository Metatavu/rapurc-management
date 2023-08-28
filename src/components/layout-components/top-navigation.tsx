import { AdminPanelSettings } from "@mui/icons-material";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import Api from "api";
import { useAppSelector } from "app/hooks";
import VisibleWithRole from "components/containers/visible-with-role";
import { ErrorContext } from "components/error-handler/error-handler";
import { selectKeycloak } from "features/auth-slice";
import { UserGroup } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Navigation component
 */
const TopNavigation: React.FC = () => {
  const keycloak = useAppSelector(selectKeycloak);
  const errorContext = React.useContext(ErrorContext);

  const navigate = useNavigate();
  const [ usersGroupsAsAdmin, setUsersGroupsAsAdmin ] = React.useState<UserGroup[]>([]);

  /**
   * Loads admin users groups from API
   * If user is group admin but not keycloak admin, users groups are returned, otherwise returns all groups
   */
  const loadUsersGroups = async () => {
    try {
      if (!keycloak?.token) return;
      const isAdmin = keycloak.hasRealmRole("admin");
      setUsersGroupsAsAdmin(
        isAdmin ?
          await Api.getUserGroupsApi(keycloak.token).listUserGroups({}) :
          await Api.getUserGroupsApi(keycloak.token).listUserGroups({ admin: true })
      );
    } catch (error) {
      errorContext.setError(strings.errorHandling.userGroups.list, error);
    }
  };

  /**
   * Effect that loads component data
   */
  useEffect(() => {
    loadUsersGroups();
  }, []);

  /**
   * Handle user group change
   *
   * @param event event
   */
  const onUserGroupChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const userGroup = usersGroupsAsAdmin.find(group => group.name === target.value)!;
    if (!userGroup.id) {
      return;
    }
    navigate(`/groups/${userGroup.id}`);
  };

  /**
   * Render the user group select
   */
  const renderUserGroupsSelect = () => {
    if (!usersGroupsAsAdmin.length) return null;

    if (usersGroupsAsAdmin.length > 1) {
      const options = usersGroupsAsAdmin.map(group =>
        <MenuItem key={ group.id } value={ group.name }>
          { group.name }
        </MenuItem>
      );

      return (
        <TextField
          color="secondary"
          variant="standard"
          select
          value={ usersGroupsAsAdmin[0].name }
          label="Groups"
          onChange={ onUserGroupChange }
        >
          { options }
        </TextField>
      );
    }
    return (
      <Button
        variant="text"
        onClick={ () => navigate(`/groups/${usersGroupsAsAdmin[0].id}`) }
      >
        { strings.navigation.groups }
      </Button>
    );
  };

  /**
   * Component render
   */
  return (
    <Stack direction="row" spacing={ 2 }>
      <Button
        variant="text"
        onClick={ () => navigate("/surveys") }
      >
        { strings.navigation.surveys }
      </Button>
      <VisibleWithRole userRole="admin">
        <Button
          variant="text"
          onClick={ () => navigate("/admin") }
          startIcon={ <AdminPanelSettings htmlColor="#fff"/> }
        >
          { strings.navigation.admin }
        </Button>
      </VisibleWithRole>
      { renderUserGroupsSelect() }
    </Stack>
  );
};

export default TopNavigation;