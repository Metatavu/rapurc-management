import { AdminPanelSettings } from "@mui/icons-material";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useAppSelector } from "app/hooks";
import VisibleWithRole from "components/containers/visible-with-role";
import { selectGroup } from "features/group-slice";
import { UserGroup } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Navigation component
 */
const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const userGroups = useAppSelector(selectGroup);
  const [ selectedGroup, setSelectedGroups ] = useState<UserGroup>();

  useEffect(() => {
    if (userGroups.length) {
      // TODO: This value should use redux, and be set from onchange
      setSelectedGroups(userGroups[0]);
    }
  }, []);

  /**
   * Handle user group change
   *
   * @param event event
   */
  const onUserGroupChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const userGroup = userGroups.find(group => group.name === target.value)!;
    setSelectedGroups(userGroup);
    navigate(`/groups/${userGroup.id}`);
  };

  // TODO: this logic to change
  /**
   * Render the user button/ select based on user groups
   */
  const renderUserGroupsButton = () => {
    if (!userGroups || !selectedGroup) return null;
    if (userGroups.length === 1) {
      return (
        <Button variant="text">
          {/* TODO: group management button for navigation not conditional */}
          { userGroups[0].name }
        </Button>
      );
    }
    // TODO: select appears between admin and icon, if multi groups, nav button for current group always there
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
          value={ selectedGroup.name }
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
      { renderUserGroupsButton() }
      <VisibleWithRole userRole="admin">
        <Button
          variant="text"
          onClick={ () => navigate("/admin") }
          startIcon={ <AdminPanelSettings htmlColor="#fff"/> }
        >
          { strings.navigation.admin }
        </Button>
      </VisibleWithRole>
    </Stack>
  );
};

export default TopNavigation;