import { Button, Paper, Stack, TextField, Typography, Container, MenuItem } from "@mui/material";
import { Reusable, Usability, Survey, ReusableMaterial, Building, Unit } from "generated/client";
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
import CategorySelect from "components/listing-components/categories";
import createItem from "components/listing-components/listing-screen-post";
import GenericDialog from "components/generic/generic-dialog";

/**
 * Form errors interface
 */
interface FormErrors {
  listingTitle?: string;
  category?: string;
  materialInfo?: string;
  materialAmount?: string;
  materialAmountInfo?: string;
  priceAmount?: string;
  unit?: string;
  propertyName?: string;
  address?: string;
  postalcode?: string;
  name?: string;
  phone?: string;
  email?: string;
}

/**
 * Selected site data
 */
interface SiteData {
  id: string;
  name: string;
  url: string;
  item: string;
  token: string;
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
    metadata: {},
    unit: undefined
  });

  /**
   * Render material unit select
   */
  const renderUnitOptions = Object.values(Unit)
    .sort((a, b) => LocalizationUtils.getLocalizedUnits(a).localeCompare(LocalizationUtils.getLocalizedUnits(b)))
    .map(unit =>
      <MenuItem key={ unit } value={ unit }>
        { LocalizationUtils.getLocalizedUnits(unit) }
      </MenuItem>
    );

  /**
   * Event handler for new material string change
   *
   * @param event React change event
   */
  const onNewMaterialChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
  
    setNewMaterial(prevMaterial => ({
      ...prevMaterial,
      [name]: value
    }));
  };

  /**
   * form values
   */
  const selectedLanguage = useAppSelector(selectLanguage);
  const [ listingTitle, setListingTitle ] = React.useState("");
  const [ materialInfo, setMaterialInfo ] = React.useState("");
  const [ material, setMaterial] = React.useState<Reusable | undefined>();
  const [ building, setBuilding ] = React.useState<Building>();
  const [ materialAmount, setMaterialAmount ] = React.useState("");
  const [ propertyName, setpropertyName ] = React.useState("");
  const [ priceAmount, setpriceAmount ] = React.useState("");
  const [ address, setAddress ] = React.useState("");
  const [ postalcode, setPostalcode ] = React.useState("");
  const [ name, setName ] = React.useState("");
  const [ phone, setPhone ] = React.useState("");
  const [ email, setEmail ] = React.useState("");
  const [ formErrors, setFormErrors ] = React.useState<FormErrors>({});
  const [ accessToken, setAccessToken ] = React.useState("");
  const [ site, setSite ] = React.useState<SiteData | null>(null);
  const [ category, setCategory] = React.useState("");
  const [ images, setImages ] = React.useState<string[]>([]);

  /**
   * Succesful POST dialog / text
   */
  const [ showSuccessDialog, setShowSuccessDialog ] = React.useState(false);
  const [ itemId, setItemId ] = React.useState<string | null>(null);
  const link = itemId && site ? `${site.item}/${itemId}` : null;
  const linkText = site ? `${site.name}` : null;
  
  /**
   * Confirmation dialog 
   */
  const [ confirmationDialogOpen, setConfirmationDialogOpen ] = React.useState(false);
  
  /**
   * Handle confirmation dialog open
   */
  const handleOpenConfirmationDialog = () => {
    setConfirmationDialogOpen(true);
  };

  /**
   * Callback function to handle successful item creation and show the success dialog
   * 
   * @param itemIdResponse 
   */
  const handleItemCreationSuccess = (itemIdResponse: string) => {
    setItemId(itemIdResponse);
    setShowSuccessDialog(true);
  };
    
  /**
   * Event handler for closing the success dialog
   */
  const handleCloseSuccessDialog = () => {
    setItemId(null);
    setShowSuccessDialog(false);
  };

  /**
   * Checking if the form displays fetched information or edited information
   */
  const updateStateValues = () => {
    if (material) {
      setMaterialInfo(material.description ?? "");
      setMaterialAmount(material.amount?.toString() ?? "");
      setListingTitle(material.componentName ?? "");
    }
    if (building && building.address) {
      setAddress(`${building?.address?.streetAddress ?? ""} ${building?.address?.city || ""}`);
      setPostalcode(building.address.postCode?.toString() ?? "");
      setpropertyName(building?.propertyName ?? "");
    }
  };

  /**
   * useEffect for initializing values to the form
   */

  React.useEffect(() => {
    updateStateValues();
  }, [material, building]);

  /**
   * Event handler for material info change
   *
   * @param event React change event
   */
  const onMaterialInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMaterialInfo(value);
  };

  /**
   * Event handler for material amount change
   *
   * @param event React change event
   */
  const onMaterialAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMaterialAmount(value);
  };

  /**
   * Event handler for listing title change
   *
   * @param event React change event
   */
  const onListingTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setListingTitle(value);
  };

  /**
   * Event handler for adress name change
   *
   * @param event React change event
   */
  const onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAddress(value);
  };

  /**
   * Event handler for postal code change
   *
   * @param event React change event
   */
  const onPostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPostalcode(value);
  };

  /**
   * Form validation
   */
  const validateForm = () => {
    const errors: FormErrors = {};
    if (!category || category.length === 0) {
      errors.category = strings.listingScreen.categorySelect;
    }
    if (listingTitle.trim() === "") {
      errors.listingTitle = strings.errorHandling.listingScreen.listingTitle;
    }
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
    
    if (!newMaterial.unit || newMaterial.unit.trim() === "") {
      errors.unit = strings.errorHandling.listingScreen.unit;
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
      errors.email = strings.errorHandling.listingScreen.email;
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
  const [ reusableMaterials, setReusableMaterials ] = React.useState<ReusableMaterial[]>([]);

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
   * Fetch possible images
   */
  const fetchImage = async () => {
    if (!keycloak?.token || !surveyId) {
      return;
    }
    try {
      const reusablesApi = Api.getSurveyReusablesApi(keycloak.token);
      const fetchImages = await reusablesApi.listSurveyReusables({
        surveyId: surveyId
      });
      const data = fetchImages.flatMap(item => item.images || []);
      setImages(data);
    } catch (error) {
      errorContext.setError(strings.errorHandling.title, error);
    }
  };
  
  /**
   * Number of images
   */
  const numberOfImages = images.length;

  /**
   * Effect for fetching survey
   */
  React.useEffect(() => {
    fetchSurvey();
  }, [ surveyId ]);
  
  /**
   * Effect for fetching material of selected row
   */
  React.useEffect(() => {
    fetchReusableMaterial();
  }, [ materialId ]);

  /**
   * Effect for fetching materials and buidings of selected row / images 
   */
  React.useEffect(() => {
    fetchReusableMaterials();
    fetchBuilding();
    fetchImage();
  }, []);
  
  if (!survey) {
    return null;
  }
  if (!material) {
    return null;
  }

  /**
   * Handle selected category from categories.tsx
   * 
   * @param selectedValue category of 3rd party
   */
  const handleCategorySelect = (selectedValue: string) => {
    setCategory(selectedValue);
  };

  /**
   * Handle access token state update
   * 
   * @param newAccessToken
   */
  const handleAccessTokenUpdate = (newAccessToken: string) => {
    setAccessToken(newAccessToken);
  };
  
  /**
   * Get selected site
   *
   * @param selectedSite 
   */
  const handleSelectedSite = (selectedSite: SiteData) => {
    setSite(selectedSite);
  };

  /**
   * Handle submitting data
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      handleOpenConfirmationDialog();
    }
  };

  /**
   * handle calling confirm dialog
   */
  const handleConfirmSubmit = () => {
    setConfirmationDialogOpen(false);
    const data = {
      title: listingTitle || "",
      category: category,
      description: materialInfo || "",
      amount: Number(materialAmount) || 0,
      price: Number(priceAmount) || 0,
      unit: (newMaterial.unit as "KG" | "TN" | "M2" | "M3" | "PCS") || "",
      propertyName: building?.propertyName || "",
      address: address || "",
      postalcode: postalcode || "",
      name: name || "",
      phone: phone || "",
      email: email || ""
    };
    createItem(data, accessToken, handleItemCreationSuccess, errorContext.setError);
  };

  /**
   * Handle confirmation dialog close
   */
  const handleCancelConfirmationDialog = () => {
    setConfirmationDialogOpen(false);
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
                value={ listingTitle }
                error={ !!formErrors.listingTitle }
                onChange={ onListingTitleChange }
                sx={{ input: { color: "black" }, label: { color: "black" } }}
              />
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
                marginBottom={ 2 }
              >
                <CategorySelect
                  accessToken={ accessToken }
                  selectedSite={ site }
                  onCategorySelect={ handleCategorySelect }
                  categoryError={ formErrors.category }
                />
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
                  inputProps={{ readOnly: true, disableunderline: true.toString() }}
                />
              </Stack>
              <TextField
                variant="outlined"
                multiline
                color="primary"
                rows={ 2 }
                name="description"
                label={ strings.survey.reusables.dataGridColumns.description }
                value={ materialInfo }
                helperText={ strings.listingScreen.materialInfoHelperText }
                onChange={ onMaterialInfoChange }
                error={ !!formErrors.materialInfo }
                sx={{
                  input: { color: "black" },
                  label: { color: "black" },
                  "& .MuiOutlinedInput-input": { color: "black" },
                  "& .MuiInputLabel-root": { color: "black" }
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 1 }
              >
                { /* amounts */ }
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name=""
                  value=""
                  label={ `${strings.survey.reusables.dataGridColumns.amount}:` }
                  type="tel"
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{
                    style: { color: "black" }, readOnly: true, disableunderline: true.toString()
                  }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name="amount"
                  label=""
                  value={ materialAmount }
                  type="number"
                  onChange={ onMaterialAmountChange }
                  error={ !!formErrors.materialAmount }
                  sx={{
                    input: { color: "black" },
                    "& .MuiOutlinedInput-input": { color: "black" },
                    "& .MuiInputLabel-root": { color: "black" }
                  }}
                  InputLabelProps={{
                    shrink: false
                  }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 1 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name=""
                  label="Kokonaishinta (alv.24%):"
                  value=""
                  type="text"
                  sx={{ label: { color: "black" }, input: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableunderline: true.toString() }}
                />
                <TextField
                  fullWidth
                  color="primary"
                  name="price"
                  value={ priceAmount }
                  label="€"
                  type="number"
                  onChange={ e => setpriceAmount(e.target.value) }
                  error={ !!formErrors.priceAmount }
                  sx={{ label: { color: "black" }, input: { color: "black" } }}
                  inputProps={{ style: { color: "black" } }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 1 }
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  select={ false }
                  color="primary"
                  name=""
                  label={`${strings.listingScreen.unit}:`}
                  value=""
                  type="text"
                  sx={{ label: { color: "black" }, input: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableunderline: true.toString() }}
                />
                <TextField
                  fullWidth
                  select
                  name="unit"
                  color="primary"
                  value={ newMaterial.unit || "" }
                  onChange={ onNewMaterialChange }
                  error={!!formErrors.unit}
                >
                  { renderUnitOptions }
                </TextField>
              </Stack>
              { /* Location of the material */ }
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
                  label={ `${strings.listingScreen.propertyName}:` }
                  value=""
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableunderline: true.toString() }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name="propertyName"
                  label=""
                  type="text"
                  value={ propertyName }
                  onChange={ e => setpropertyName(e.target.value) }
                  error={!!formErrors.propertyName}
                  sx={{
                    input: { color: "black" },
                    "& .MuiOutlinedInput-input": { color: "black" },
                    "& .MuiInputLabel-root": { color: "black" }
                  }}
                  InputLabelProps={{
                    shrink: false
                  }}
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
                  label={ `${strings.listingScreen.address}:` }
                  value=""
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableunderline: true.toString() }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name="address"
                  label=""
                  type="text"
                  value={ address }
                  onChange={ onAddressChange }
                  error={ !!formErrors.address }
                  sx={{
                    input: { color: "black" },
                    "& .MuiOutlinedInput-input": { color: "black" },
                    "& .MuiInputLabel-root": { color: "black" }
                  }}
                  InputLabelProps={{
                    shrink: false
                  }}
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
                  label={ `${strings.listingScreen.postalCode}:` }
                  value=""
                  sx={{ label: { color: "black" } }}
                  InputLabelProps={{
                    shrink: false
                  }}
                  inputProps={{ readOnly: true, disableunderline: true.toString() }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  color="primary"
                  name="postalCode"
                  label=""
                  type="text"
                  value={ building?.address?.postCode }
                  error={ !!formErrors.postalcode }
                  onChange={ onPostalCodeChange }
                  sx={{
                    input: { color: "black" },
                    "& .MuiOutlinedInput-input": { color: "black" },
                    "& .MuiInputLabel-root": { color: "black" }
                  }}
                  InputLabelProps={{
                    shrink: false
                  }}
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
              <TextField
                fullWidth
                color="primary"
                name="image"
                label={`${strings.survey.summary.images} ${strings.survey.reusables.units.pcs ?? ""}`}
                type="text"
                value={ numberOfImages }
                sx={{ label: { color: "black" }, marginLeft: "2px" }}
                inputProps={{ readOnly: true, disableunderline: true.toString() }}
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
                  disabled
                >
                  { strings.listingScreen.deleteOwnUse }
                </Button>
                <Button
                  variant="contained"
                  disabled
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
          <GenericDialog
            open={ confirmationDialogOpen }
            title={ strings.listingScreen.title }
            positiveButtonText={ strings.listingScreen.send }
            cancelButtonText={ strings.generic.cancel }
            onClose={ handleCancelConfirmationDialog }
            onCancel={ handleCancelConfirmationDialog }
            onConfirm={ handleConfirmSubmit }
          >
            {strings.listingScreen.submitConfirm}
          </GenericDialog>
        </Stack>
      ) : (
        <></>
      )}
      <GenericDialog
        open={ showSuccessDialog }
        title={ strings.listingScreen.submit }
        onClose={ handleCloseSuccessDialog }
        positiveButtonText="OK"
        onConfirm={ handleCloseSuccessDialog }
      >
        {linkText && link && (
          <Typography>
            { strings.listingScreen.submitLinkText }
            <a href={ link } target="_blank" rel="noopener noreferrer">
              { linkText }
            </a>
          </Typography>
        )}
      </GenericDialog>
      <LoginDialog
        open={ open }
        onClose={ handleCloseDialog }
        onLogin={ handleLogin }
        onAccessTokenUpdate={ handleAccessTokenUpdate }
        loggedSite={ handleSelectedSite }
      />
    </Container>
  );
};
export default SurveyListingScreen;