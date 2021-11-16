import { Delete } from "@mui/icons-material";
import { Button, IconButton, List, ListItemSecondaryAction, Stack, Typography } from "@mui/material";
import strings from "localization/strings";
import * as React from "react";
import { MaterialItem, MaterialText } from "../../styled/layout-components/material-item";

/**
 * Component for waste materials dropdown menu editor
 */
const Waste: React.FC = () => {
  /**
   * Item for waste material
   * 
   * @param name 
   * @param code 
   * @returns waste material item
   */
  const wasteMaterialItem = (name: string, code: number) => (
    <MaterialItem>
      <MaterialText primary={ name } secondary={ code }/>
      <ListItemSecondaryAction>
        <IconButton>
          <Delete/>
        </IconButton>
      </ListItemSecondaryAction>
    </MaterialItem>
  );

  /**
   * Renders list of materials
   */
  const renderList = () => (
    <List sx={{ pt: 4 }}>
      { wasteMaterialItem("Betoni", 1234) }
    </List>
  );

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h2">
          { strings.adminScreen.navigation.dropdownSettings.wasteMaterials }
        </Typography>
        <Button color="secondary">
          { strings.generic.addNew }
        </Button>
      </Stack>
      { renderList() }
    </>
  );
};

export default Waste;