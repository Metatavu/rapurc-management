import { Button, MenuItem, Paper, Stack, TextField, Typography, Container } from "@mui/material";
import { Reusable, Unit, Usability } from "generated/client";
import strings from "localization/strings";
import * as React from "react";
import LocalizationUtils from "utils/localization-utils";
/**
 * Everything to do with language, api and routing are temporary, this is just a base to be coded on
 */
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
  /**
  * Component for reusable materials and building parts (to showcase options TEMPORARY)
  */
  const [ newMaterial, setNewMaterial ] = React.useState<Reusable>({
    componentName: "",
    usability: Usability.NotValidated,
    reusableMaterialId: "",
    metadata: {}
  });

  /**
   * Event handler for new material string change
   *
   * @param event React change event
   */
  const onNewMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setNewMaterial({ ...newMaterial, [name]: value });
  };

  const unitOptions = Object.values(Unit)
    
    .sort((a, b) =>
      LocalizationUtils.getLocalizedUnits(a).localeCompare(LocalizationUtils.getLocalizedUnits(b)))
    
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
        overflow="auto"
      >
        <Paper>
          { /* Otsikko */ }
          <Typography variant="h1" margin={1} textAlign="center">
            Tee ilmoitus kauppapaikkaan
          </Typography>
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Ilmoituksen otsikko"
            value="ovi"
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
              value="rakennusosat"
              label="Materiaali"
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartOrMaterialHelperText }
            />
            <TextField
              fullWidth
              select={false}
              color="primary"
              name="reusableMaterialId"
              value="valittu rakennusosa"
              label="Materiaali"
            />
          </Stack>
          <TextField
            multiline
            rows={ 2 }
            name="description"
            label="Materiaalin kuvaus"
            value={newMaterial.description}
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.descriptionHelperText }
            onChange={ onNewMaterialChange }
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
              value={ newMaterial.amount }
              label="Arvio materiaalin määrästä"
              type="number"
              onChange={ onNewMaterialChange }
            />
            <TextField
              fullWidth
              select={false}
              color="primary"
              name="amount"
              value={ newMaterial.amount }
              label="Annettu arvo"
              type="number"
              onChange={ onNewMaterialChange }
            />
          </Stack>
          <Stack
            direction="row"
            spacing={ 2 }
            marginTop={ 2 }
          >
            <TextField
              fullWidth
              select
              name="unit"
              color="primary"
              value={ newMaterial.unit }
              label={ strings.survey.reusables.dataGridColumns.unit }
              onChange={ onNewMaterialChange }
            >
              { unitOptions }
            </TextField>
            <TextField
              fullWidth
              select={false}
              color="primary"
              name="amount"
              value={ newMaterial.amount }
              label="Annettu arvo"
              type="number"
              onChange={ onNewMaterialChange }
            />
          </Stack>
          <Stack spacing={ 2 } marginTop={ 2 }>
            <TextField
              multiline
              rows={ 2 }
              name="description"
              label="Lisätieto määrästä"
              value={ newMaterial.description }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.descriptionHelperText }
              onChange={ onNewMaterialChange }
            />
          </Stack>
          { /* Location of the material */ }
          <Stack spacing={ 2 } marginTop={ 2 }>
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Kohteen nimi"
              value={ newMaterial.componentName }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ onNewMaterialChange }
            />
          </Stack>
          <Stack
            direction="row"
            spacing={ 2 }
            marginTop={ 2 }
          >
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Katuosoite"
              value={ newMaterial.componentName }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ onNewMaterialChange }
            />
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Annettu arvo"
              value={ newMaterial.componentName }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ onNewMaterialChange }
            />
          </Stack>
          <Stack
            direction="row"
            spacing={ 2 }
            marginTop={ 2 }
          >
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Postinumero"
              value={ newMaterial.componentName }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ onNewMaterialChange }
            />
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Annettu arvo"
              value={ newMaterial.componentName }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ onNewMaterialChange }
            />
          </Stack>
          {/* kunta/alue */}
          <TextField
            fullWidth
            select
            name="unit"
            color="primary"
            value={ newMaterial.componentName}
            label="Kunta/Alue"
            onChange={ onNewMaterialChange }
          >
            { unitOptions }
          </TextField>
          {/* Yhteystiedot */}
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Nimi"
            value={ newMaterial.componentName }
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
            onChange={ onNewMaterialChange }
          />
          { /* puh */ }
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Puhelinnumero"
            value={ newMaterial.unit }
            helperText="040 ..."
            onChange={ onNewMaterialChange }
          />
          { /* e-mail */ }
          <TextField
            fullWidth
            color="primary"
            name="componentName"
            label="Sähköposti"
            value={ newMaterial.componentName }
            helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
            onChange={ onNewMaterialChange }
          />
          <Stack
            direction="row"
            spacing={ 2 }
            marginTop={ 2 }
            marginBottom={ 2 }
            justifyContent="center"
          >
            <Button
              variant="contained"
            >
              peruuta
            </Button>
            <Button
              variant="contained"
            >
              POISTA OMA KÄYTTÖ
            </Button>
            <Button
              variant="contained"
            >
              OMAAN KÄYTTÖÖN
            </Button>
            <Button
              variant="contained"
              disabled
            >
              lähetä
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
export default SurveyListingScreen;