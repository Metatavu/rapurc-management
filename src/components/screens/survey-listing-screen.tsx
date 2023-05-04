import { Add, Delete } from "@mui/icons-material";
import { Box, Button, CircularProgress, Container, Fab, Grid, Hidden, List, MenuItem, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import Api from "api";
import { useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import GenericDialog from "components/generic/generic-dialog";
import WithDebounce from "components/generic/with-debounce";
import { selectKeycloak } from "features/auth-slice";
import { Unit } from "generated/client";
import strings from "localization/strings";
import * as React from "react";
import theme from "theme";
import LocalizationUtils from "utils/localization-utils";
import { selectLanguage } from "features/locale-slice";

/**
 * Component properties
interface Props {
  surveyId: string;
}
*/
const SurveyListingScreen: React.FC = () => {
  // const keycloak = useAppSelector(selectKeycloak);
  // const errorContext = React.useContext(ErrorContext);
  // const selectedLanguage = useAppSelector(selectLanguage);

  const unitOptions = Object.values(Unit)
    .sort((a, b) => LocalizationUtils.getLocalizedUnits(a).localeCompare(LocalizationUtils.getLocalizedUnits(b)))
    .map(unit =>
      <MenuItem key={ unit } value={ unit }>
        { LocalizationUtils.getLocalizedUnits(unit) }
      </MenuItem>
    );
  /**
  * Render listing UI
  */
  return (
    <Container maxWidth="md">
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Paper>
          { /* Otsikko */ }
          <Typography>
            Tee ilmoitus kauppapaikkaan
          </Typography>
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Ilmoituksen otsikko"
            value="newMaterial.componentName"
          />
        
          <Stack
            direction="row"
            spacing={ 2 }
            marginTop={ 2 }
          >
            <TextField
              fullWidth
              select
              color="primary"
              name="reusableMaterialId"
              value="newMaterial.reusableMaterialId "
              label="Materiaali"
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartOrMaterialHelperText }
            />
          </Stack>
          <TextField
            multiline
            rows={ 6 }
            name="description"
            label="Materiaalin kuvaus"
            value="newMaterial.description"
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.descriptionHelperText }
          />
          <Stack
            direction="row"
            spacing={ 2 }
            marginTop={ 2 }
          >
            { /* Määrät */ }
            <TextField
              fullWidth
              color="primary"
              name="amount"
              value="newMaterial.amount"
              label="Arvio materiaalin määrästä"
              type="number"
            />
            <TextField
              fullWidth
              select
              name="unit"
              color="primary"
              value="newMaterial.unit"
              label={ strings.survey.reusables.dataGridColumns.unit }
            >
              { unitOptions }
            </TextField>
          </Stack>
          <Stack spacing={ 2 } marginTop={ 2 }>
            <TextField
              multiline
              rows={ 6 }
              name="description"
              label="Lisätieto määrästä"
              value="newMaterial.description"
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.descriptionHelperText }
            />
          </Stack>
          { /* Location of the material */ }
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Kohteen nimi"
            value="newMaterial.componentName"
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
          />
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Katuosoite"
            value="newMaterial.componentName"
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
          />
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Postinumero"
            value="newMaterial.componentName"
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
          />
          {/* kunta/alue */}
          <TextField
            fullWidth
            select
            name="unit"
            color="primary"
            value="newMaterial.unit"
            label="Kunta/Alue"
          >
            { unitOptions }
          </TextField>
          {/* Yhteystiedot */}
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Nimi"
            value={ 0 }
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
          />
          { /* puh */ }
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Puhelinnumero"
            value={ 0 }
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
          />
          { /* e-mail */ }
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Sähköposti"
            value={ 0 }
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
          />
        </Paper>
      </Stack>
    </Container>
  );
};
export default SurveyListingScreen;