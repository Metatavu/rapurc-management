import { AdminPanelSettings } from "@mui/icons-material";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import VisibleWithRole from "components/containers/visible-with-role";
import { selectGroups, selectSelectedGroup, setSelectedGroup } from "features/group-slice";
import strings from "localization/strings";
import React, { ChangeEventHandler } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Navigation component
 */
const TopNavigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userGroups = useAppSelector(selectGroups);
  const selectedUserGroup = useAppSelector(selectSelectedGroup);

  /**
   * Navigate to group management screen with selected group if available
   */
  const navigateToGroupManagement = () => {
    if (selectedUserGroup) {
      navigate(`/groups/${selectedUserGroup.id}`);
    } else {
      navigate("/groups");
    }
  };

  /**
   * Handle user group change
   *
   * @param event event
   */
  const onUserGroupChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const userGroup = userGroups.find(group => group.name === target.value)!;
    dispatch(setSelectedGroup(userGroup));
    navigate(`/groups/${userGroup.id}`);
  };

  /**
   * Render the usder group select
   */
  const renderUserGroupsSelect = () => {
    if (!userGroups || !selectedUserGroup) return null;

    if (userGroups.length > 1) {
      const options = userGroups.map(group =>
        <MenuItem key={ group.id } value={ group.name }>
          { group.name }
        </MenuItem>
      );

      return (
        <TextField
          color="secondary"
          variant="standard"
          select
          value={ selectedUserGroup.name }
          label="Groups"
          onChange={ onUserGroupChange }
        >
          { options }
        </TextField>
      );
    }
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
      <Button
        variant="text"
        onClick={ () => navigateToGroupManagement() }
      >
        { strings.navigation.groups }
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