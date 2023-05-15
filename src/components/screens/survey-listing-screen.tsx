import { Button, Paper, Stack, TextField, Typography, Container } from "@mui/material";
import { Reusable, Usability, Survey } from "generated/client";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/error-handler/error-handler";
import { useAppDispatch } from "app/hooks";
import { fetchSelectedSurvey } from "features/surveys-slice";
import * as React from "react";
import strings from "localization/strings";
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
  name?: string;
  phone?: string;
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
  /**
   * form values
   */
  const [materialInfo, setMaterialInfo] = React.useState("");
  const [materialAmount, setMaterialAmount] = React.useState("");
  const [propertyName, setpropertyName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalcode, setPostalcode ] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  /**
   * form validation
  */
  const validateForm = () => {
    const errors: FormErrors = {};

    if (materialInfo.trim() === "") {
      errors.materialInfo = strings.errorHandling.listingScreen.materialInfo;
    }

    if (materialAmount.trim() === "") {
      errors.materialAmount = "Material amount is required";
    } else if (Number.isNaN(Number(materialAmount))) {
      errors.materialAmount = strings.errorHandling.listingScreen.materialAmount;
    }

    if (propertyName.trim() === "") {
      errors.propertyName = strings.errorHandling.listingScreen.propertyName;
    }

    if (address.trim() === "") {
      errors.address = strings.errorHandling.listingScreen.address;
    }

    if (postalcode.trim() === "") {
      errors.postalcode = strings.errorHandling.listingScreen.postalcode;
    }

    if (name.trim() === "") {
      errors.name = strings.errorHandling.listingScreen.name;
    }

    if (phone.trim() === "") {
      errors.phone = strings.errorHandling.listingScreen.phone;
    } else if (Number.isNaN(Number(phone))) {
      errors.phone = strings.errorHandling.listingScreen.phone;
    }

    if (email.trim() === "") {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = strings.errorHandling.listingScreen.email;
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
            { strings.listingScreen.title }
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label="Ilmoituksen otsikko"
              value="GET"
              disabled
            />
            <Stack
              direction="row"
              spacing={ 2 }
              marginTop={ 2 }
            >
              <TextField
                fullWidth
                select={false}
                color="primary"
                name="reusableMaterialId"
                value="GET"
                label={strings.survey.reusables.addNewBuildingPartsDialog.buildingPartOrMaterial}
                disabled
              />
            </Stack>
            <TextField
              multiline
              rows={ 2 }
              name="description"
              label={strings.survey.reusables.dataGridColumns.description }
              value={materialInfo}
              helperText={ strings.listingScreen.materialInfoHelperText }
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
                label={ strings.survey.reusables.dataGridColumns.amount }
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
                label="GET"
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
                select={false}
                color="primary"
                name="amount"
                value={ newMaterial.amount }
                label="GET"
                onChange={ onNewMaterialChange }
                disabled
              />
            </Stack>
            { /* Location of the material */ }
            <Stack spacing={ 2 } marginTop={ 2 }>
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="GET"
                value={ propertyName }
                helperText={ strings.listingScreen.propertyName }
                onChange={ e => setpropertyName(e.target.value) }
                error={!!formErrors.propertyName}
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
                label={ strings.listingScreen.address }
                value={ address }
                onChange={ e => setAddress(e.target.value) }
                error={!!formErrors.address}
              />
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="GET"
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
                label={ strings.listingScreen.postalCode }
                value={ postalcode }
                onChange={ e => setPostalcode(e.target.value) }
                error={!!formErrors.postalcode}
              />
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="GET"
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
              label={strings.listingScreen.name}
              value={ name }
              onChange={ e => setName(e.target.value) }
              error={!!formErrors.name}
            />
            { /* puh */ }
            <TextField
              fullWidth
              color="primary"
              name="componentName"
              label={ strings.listingScreen.phone }
              type="tel"
              value={ phone }
              onChange={ e => setPhone(e.target.value) }
              error={!!formErrors.phone}
            />
            { /* e-mail */ }
            <TextField
              fullWidth
              required
              color="primary"
              name="componentName"
              label={ strings.listingScreen.email }
              type="email"
              value={ email }
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
                { strings.generic.cancel }
              </Button>
              <Button
                variant="contained"
              >
                { strings.listingScreen.deleteOwnUse }
              </Button>
              <Button
                variant="contained"
              >
                { strings.listingScreen.ownUse }
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                { strings.listingScreen.send }
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
};
export default SurveyListingScreen;