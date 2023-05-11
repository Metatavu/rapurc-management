import { Button, MenuItem, Paper, Stack, TextField, Typography, Container } from "@mui/material";
import { Reusable, Unit, Usability, Survey } from "generated/client";
import strings from "localization/strings";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/error-handler/error-handler";
import { useAppDispatch } from "app/hooks";
import { fetchSelectedSurvey } from "features/surveys-slice";
import * as React from "react";
import LocalizationUtils from "utils/localization-utils";
/**
 * interfaces
 */
interface FormErrors {
  materialInfo?: string;
  materialAmount?: string;
  materialAmountInfo?: string;
  propertyName?: string;
  address?: string;
  postalcode?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
}
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
   * form values
   */
  const [materialInfo, setMaterialInfo] = React.useState("");
  const [materialAmount, setMaterialAmount] = React.useState("");
  const [materialAmountInfo, setmaterialAmountInfo] = React.useState("");
  const [propertyName, setpropertyName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalcode, setPostalcode ] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  /**
   * form validation
  */
  const validateForm = () => {
    const errors: FormErrors = {};

    if (materialInfo.trim() === "") {
      errors.materialInfo = "Material info is required";
    }

    if (materialAmount.trim() === "") {
      errors.materialAmount = "Material amount is required";
    } else if (Number.isNaN(Number(materialAmount))) {
      errors.materialAmount = "Material amount must be a number";
    }

    if (materialAmountInfo.trim() === "") {
      errors.materialAmountInfo = "Material amount info is required";
    }

    if (propertyName.trim() === "") {
      errors.propertyName = "Property name is required";
    }

    if (address.trim() === "") {
      errors.address = "Address is required";
    }

    if (postalcode.trim() === "") {
      errors.postalcode = "Postal code is required";
    }

    if (username.trim() === "") {
      errors.username = "Name is required";
    }

    if (phoneNumber.trim() === "") {
      errors.phoneNumber = "Phone number is required";
    } else if (Number.isNaN(Number(phoneNumber))) {
      errors.phoneNumber = "Phone number must be a number";
    }

    if (email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
  /**
   * Submit handle
   */
  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (validateForm()) {
      // If validation true --> send info
    }
  };
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
   * Get the SurveyId
   */
  const dispatch = useAppDispatch();
  const errorContext = React.useContext(ErrorContext);
  const { surveyId } = useParams<"surveyId">();
  const navigate = useNavigate();
  const [ survey, setSurvey ] = React.useState<Survey | undefined>();

  /**
   * Fetches survey based on URL survey ID
   */
  const fetchSurvey = async () => {
    if (!surveyId) {
      return;
    }

    try {
      const selectedSurvey = await dispatch(fetchSelectedSurvey(surveyId)).unwrap();
      setSurvey(selectedSurvey);
    } catch (error) {
      errorContext.setError(strings.errorHandling.surveys.find, error);
    }
  };

  /**
   * Effect for fetching surveys. Triggered when survey ID is changed
   */
  React.useEffect(() => { fetchSurvey(); }, [ surveyId ]);

  if (!survey) {
    return null;
  }

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
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Ilmoituksen otsikko"
              value="ovi"
              disabled
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
                disabled
              />
            </Stack>
            <TextField
              multiline
              rows={ 2 }
              name="description"
              label="Materiaalin kuvaus"
              value={materialInfo}
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.descriptionHelperText }
              onChange={ e => setMaterialInfo(e.target.value) }
              error={!!formErrors.materialInfo}
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
                value={ materialAmount }
                label="Arvio materiaalin määrästä"
                type="number"
                onChange={ e => setMaterialAmount(e.target.value) }
                error={!!formErrors.materialAmount}
              />
              <TextField
                fullWidth
                select={false}
                color="primary"
                name="amount"
                value={ newMaterial.amount }
                label="Annettu arvo"
                type="tel"
                onChange={ onNewMaterialChange }
                disabled
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
                type="tel"
                onChange={ onNewMaterialChange }
                disabled
              />
            </Stack>
            <Stack spacing={ 2 } marginTop={ 2 }>
              <TextField
                multiline
                rows={ 2 }
                name="description"
                label="Lisätieto määrästä"
                value={ materialAmountInfo }
                helperText={ strings.survey.reusables.addNewBuildingPartsDialog.descriptionHelperText }
                onChange={ e => setmaterialAmountInfo(e.target.value) }
                error={!!formErrors.materialAmountInfo}
              />
            </Stack>
            { /* Location of the material */ }
            <Stack spacing={ 2 } marginTop={ 2 }>
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="Kohteen nimi"
                value={ propertyName }
                helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
                onChange={ e => setpropertyName(e.target.value) }
                error={!!formErrors.propertyName}
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
                value={ address }
                helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
                onChange={ e => setAddress(e.target.value) }
                error={!!formErrors.address}
              />
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="Annettu arvo"
                type="text"
                value={ newMaterial.componentName }
                onChange={ onNewMaterialChange }
                disabled
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
                value={ postalcode }
                helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
                onChange={ e => setPostalcode(e.target.value) }
                error={!!formErrors.postalcode}
              />
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="Annettu arvo"
                type="text"
                value={ newMaterial.componentName }
                onChange={ onNewMaterialChange }
                disabled
              />
            </Stack>
            {/* Yhteystiedot */}
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Nimi"
              value={ username }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ e => setUsername(e.target.value) }
              error={!!formErrors.username}
            />
            { /* puh */ }
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Puhelinnumero"
              type="tel"
              value={ phoneNumber }
              helperText="040 ..."
              onChange={ e => setPhoneNumber(e.target.value) }
              error={!!formErrors.phoneNumber}
            />
            { /* e-mail */ }
            <TextField
              fullWidth
              required
              color="primary"
              name="componentName"
              label="Sähköposti"
              type="email"
              value={ email }
              helperText={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartHelperText }
              onChange={ e => setEmail(e.target.value) }
              error={!!formErrors.email}
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
                onClick={() => navigate(-1)}
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
                type="submit"
                variant="contained"
              >
                lähetä
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
};
export default SurveyListingScreen;