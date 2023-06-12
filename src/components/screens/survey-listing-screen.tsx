import { Button, Paper, Stack, TextField, Typography, Container } from "@mui/material";
import { Reusable, Usability, Survey, ReusableMaterial, Building } from "generated/client";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorContext } from "components/error-handler/error-handler";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { fetchSelectedSurvey } from "features/surveys-slice";
import * as React from "react";
import strings from "localization/strings";
import Api from "api";
import { selectKeycloak } from "features/auth-slice";
import LocalizationUtils from "utils/localization-utils";
import { selectLanguage } from "features/locale-slice";
import LoginDialog from "components/listing-components/login-dialog";

/**
 * Form errors interface
 */
interface FormErrors {
  materialInfo?: string;
  materialAmount?: string;
  materialAmountInfo?: string;
  priceAmount?: string;
  propertyName?: string;
  address?: string;
  postalcode?: string;
  name?: string;
  phone?: string;
  email?: string;
}

/**
 * Listing screen component
 */
const SurveyListingScreen: React.FC = () => {
  const keycloak = useAppSelector(selectKeycloak);
  const errorContext = React.useContext(ErrorContext);

  /**
   * Login states
   */
  const [open, setOpen] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);

  /**
   * Login handle
   */
  const handleLogin = () => {
    setLoggedIn(true);
  };

  /**
   * Login dialog close
   */
  const handleCloseDialog = () => {
    setOpen(false);
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
  const selectedLanguage = useAppSelector(selectLanguage);
  const [ materialInfo, setMaterialInfo ] = React.useState("");
  const [ materialAmount, setMaterialAmount ] = React.useState("");
  const [ propertyName, setpropertyName ] = React.useState("");
  const [ priceAmount, setpriceAmount ] = React.useState("");
  const [ address, setAddress ] = React.useState("");
  const [ postalcode, setPostalcode ] = React.useState("");
  const [ name, setName ] = React.useState("");
  const [ phone, setPhone ] = React.useState("");
  const [ email, setEmail ] = React.useState("");
  const [ formErrors, setFormErrors ] = React.useState<FormErrors>({});

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

    if (priceAmount.trim() === "") {
      errors.priceAmount = "Price is required";
    } else if (Number.isNaN(Number(priceAmount))) {
      errors.priceAmount = strings.errorHandling.listingScreen.priceAmount;
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
   * Get the SurveyId
   */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { surveyId } = useParams<"surveyId">();
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
   * Get needed fetch for the form, material row data, Building property name
   */
  const { materialId } = useParams<"materialId">();
  const [ material, setMaterial ] = React.useState<Reusable | undefined>();
  const [ reusableMaterials, setReusableMaterials ] = React.useState<ReusableMaterial[]>([]);
  const [ building, setBuilding ] = React.useState<Building>();

  /**
   * Fetches reusable materials by materialID
   */
  const fetchReusableMaterial = async () => {
    if (!keycloak?.token || !materialId || !surveyId) {
      return;
    }

    try {
      const selectedReusableMaterial = await Api.getSurveyReusablesApi(keycloak.token).findSurveyReusable({ surveyId: surveyId, reusableId: materialId });
      setMaterial(selectedReusableMaterial);
    } catch (error) {
      errorContext.setError(strings.errorHandling.materials.list, error);
    }
  };

  /**
   * Fetches list of reusable materials and building parts
   */
  const fetchReusableMaterials = async () => {
    if (!keycloak?.token) {
      return;
    }

    try {
      setReusableMaterials(await Api.getReusableMaterialApi(keycloak.token).listReusableMaterials());
    } catch (error) {
      errorContext.setError(strings.errorHandling.materials.list, error);
    }
  };

  /**
  * Fetch Building property name
  */
  const fetchBuilding = async () => {
    if (!keycloak?.token || !surveyId) {
      return;
    }

    try {
      const fetchedBuildings = await Api.getBuildingsApi(keycloak.token).listBuildings({
        surveyId: surveyId
      });

      if (fetchedBuildings.length !== 1) {
        return;
      }

      setBuilding(fetchedBuildings[0]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.buildings.list, error);
    }
  };

  /**
   * Effect for fetching survey / materials of selected row
   */
  React.useEffect(() => {
    fetchSurvey();
  }, [ surveyId ]);
  
  React.useEffect(() => {
    fetchReusableMaterial();
  }, [ materialId ]);
  
  React.useEffect(() => {
    fetchReusableMaterials();
    fetchBuilding();
  }, []);
  
  if (!survey) {
    return null;
  }
  if (!material) {
    return null;
  }

  /**
   * Submit handle. Sending data added later
   */
  const handleSubmit = (e:any) => {
    e.preventDefault();
    /* const data = {
      description: material?.description || "",
      amount: newMaterial?.amount || "",
      price: priceAmount,
      unit: material?.unit || "",
      propertyName: building?.propertyName || "",
      address: `${building?.address?.streetAddress}, ${building?.address?.city}` || "",
      postalcode: building?.address?.postCode || "",
      name: name || "",
      phone: phone || "",
      email: email || ""
    };
    */
    if (validateForm()) {
      // If validation true --> send info
    }
  };
  
  /**
   * Render listing component
   */
  return (
    <Container maxWidth="md">
      {loggedIn ? (
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={ 1 }
          overflow="auto"
        >
          <Paper>
            { /* header */ }
            <Typography variant="h1" margin={ 1 } marginBottom={ 4 } textAlign="center">
              { strings.listingScreen.title }
            </Typography>
            <form onSubmit={ handleSubmit }>
              <TextField
                variant="outlined"
                fullWidth
                color="primary"
                name="componentName"
                label="Ilmoituksen otsikko"
                value={ material.componentName }
                sx={{ input: { color: "black" }, label: { color: "black" } }}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{ readOnly: true, disableUnderline: true }}
              />
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
                marginBottom={ 2 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name="reusableMaterialId"
                  label={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartOrMaterial }
                  value={ LocalizationUtils.getLocalizedName(reusableMaterials
                    .find(materials => (materials.id === material.reusableMaterialId))?.localizedNames || [], selectedLanguage)}
                  sx={{ input: { color: "black" }, label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
              </Stack>
              <TextField
                variant="outlined"
                multiline
                color="primary"
                rows={ 2 }
                name="description"
                label={ strings.survey.reusables.dataGridColumns.description }
                value={ material.description }
                helperText={ strings.listingScreen.materialInfoHelperText }
                onChange={ e => setMaterialInfo(e.target.value) }
                error={ !!formErrors.materialInfo }
                sx={{
                  input: { color: "black" }, label: { color: "black" }
                }}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{ style: { color: "black" } }}
              />
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
              >
                { /* amounts */ }
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name=""
                  value={ materialAmount }
                  label={ strings.survey.reusables.dataGridColumns.amount }
                  type="number"
                  onChange={ e => setMaterialAmount(e.target.value) }
                  error={ !!formErrors.materialAmount }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{
                    style: { color: "black" }, readOnly: true, disableUnderline: true
                  }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name="amount"
                  label={ material.amount }
                  value={ newMaterial.amount }
                  type="tel"
                  onChange={ onNewMaterialChange }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name=""
                  label="Kokonaishinta (alv.24%)"
                  value=""
                  type="number"
                  sx={{ label: { color: "black" }, input: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
                <TextField
                  fullWidth
                  color="primary"
                  name="price"
                  value={ priceAmount }
                  label="€"
                  type="number"
                  onChange={ e => setpriceAmount(e.target.value) }
                  sx={{ label: { color: "black" }, input: { color: "black" } }}
                  inputProps={{ style: { color: "black" } }}
                />
              </Stack>
              <Stack
                direction="column"
                spacing={ 2 }
                marginTop={ 2 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name="unit"
                  label={ strings.listingScreen.unit }
                  value={ material.unit }
                  onChange={ onNewMaterialChange }
                  sx={{ input: { color: "black" }, label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
              </Stack>
              { /* Location of the material */ }
              <Stack spacing={ 2 } marginTop={ 2 }>
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name="propertyName"
                  label={ building?.propertyName || "" }
                  value={ propertyName }
                  helperText={ strings.listingScreen.propertyName }
                  onChange={ e => setpropertyName(e.target.value) }
                  error={ !!formErrors.propertyName }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name=""
                  label={ strings.listingScreen.address }
                  value={ address }
                  onChange={ e => setAddress(e.target.value) }
                  error={ !!formErrors.address }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name="address"
                  label={ `${building?.address?.streetAddress} ${building?.address?.city}`}
                  type="text"
                  value={ newMaterial.componentName }
                  onChange={ onNewMaterialChange }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name=""
                  label={ strings.listingScreen.postalCode }
                  value={ postalcode }
                  onChange={ e => setPostalcode(e.target.value) }
                  error={ !!formErrors.postalcode }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name="postalCode"
                  label={ building?.address?.postCode }
                  type="text"
                  value={ newMaterial.componentName }
                  onChange={ onNewMaterialChange }
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableUnderline: true }}
                />
              </Stack>
              {/* Contact info */}
              <TextField
                fullWidth
                color="primary"
                name="name"
                label={ strings.listingScreen.name }
                value={ name }
                onChange={ e => setName(e.target.value) }
                error={ !!formErrors.name }
                sx={{ label: { color: "black" }, marginLeft: "2px" }}
              />
              { /* tel */ }
              <TextField
                fullWidth
                color="primary"
                name="phone"
                label={ strings.listingScreen.phone }
                type="tel"
                value={ phone }
                onChange={ e => setPhone(e.target.value) }
                error={ !!formErrors.phone }
                sx={{ label: { color: "black" }, marginLeft: "2px" }}
              />
              { /* e-mail */ }
              <TextField
                fullWidth
                required
                color="primary"
                name="email"
                label={ strings.listingScreen.email }
                type="email"
                value={ email }
                onChange={ e => setEmail(e.target.value) }
                error={ !!formErrors.email }
                sx={{ label: { color: "black" }, marginLeft: "2px" }}
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
                  onClick={ () => navigate(`/surveys/${surveyId}/reusables`) }
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
      ) : (
        <></>
      )}
      <LoginDialog
        open={ open }
        onClose={ handleCloseDialog }
        onLogin={ handleLogin }
      />
    </Container>
  );
};
export default SurveyListingScreen;