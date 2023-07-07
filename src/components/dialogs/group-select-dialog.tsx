import { Button, Stack } from "@mui/material";
import GenericDialog from "components/generic/generic-dialog";
import { UserGroup } from "generated/client";
import strings from "localization/strings";
import * as React from "react";

/**
 * Components properties
 */
interface Props {
  open: boolean;
  groups: UserGroup[];
  onClose: () => void;
  onGroupSelect: (groupId: string) => Promise<void>;
}

/**
 * Group select dialog component
 */
const GroupSelectDialog = ({
  open,
  groups,
  onClose,
  onGroupSelect
}: Props) => {
  /**
   * Renders group select button
   */
  const renderGroupSelectButton = (group: UserGroup) => {
    if (!group.id) return;
    
    return (
      <Button
        key={ group.id }
        onClick={ () => onGroupSelect(group.id!) }
      >
        { group.name }
      </Button>
    );
  };
  
  return (
    <GenericDialog
      title={ strings.surveysScreen.groupSelectDialog.title }
      cancelButtonText={ strings.generic.cancel }
      open={ open }
      onClose={ onClose }
      onCancel={ onClose }
      fullWidth
    >
      <Stack spacing={ 2 }>
        { groups.map(renderGroupSelectButton) }
      </Stack>
    </GenericDialog>
    
  );
};

export default GroupSelectDialog;