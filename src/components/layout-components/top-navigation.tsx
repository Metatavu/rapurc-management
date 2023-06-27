import { AdminPanelSettings } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { useAppSelector } from "app/hooks";
import VisibleWithRole from "components/containers/visible-with-role";
import { selectGroup } from "features/group-slice";
import strings from "localization/strings";
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Navigation component
 */
const TopNavigation: React.FC = () => {
  const navigate = useNavigate();
  const userGroups = useAppSelector(selectGroup);

  console.log("user groups in redux are", userGroups);

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
      {/* TODO: This needs to be a drop down if multiple groups */}
      <Button variant="text">
        { userGroups[0] ? userGroups[0].name : "" }
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
    </Stack>
  );
};

export default TopNavigation;