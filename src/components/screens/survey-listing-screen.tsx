import { Button, Paper, Stack, TextField, Typography, Container, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, FormLabel, FormControl, Radio, RadioGroup, Link } from "@mui/material";
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
interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}
interface Site {
  id: string;
  name: string;
  url: string;
}
/**
 * list of sites rendered as buttons to select to send the listing form to
 */
const siteList: Site[] = [
  {
    id: "site1", name: "Kiertoon.fi", url: "https://kiertoon.fi/items"
  },
  {
    id: "site2", name: "tori.fi", url: "https://tori.fi"
  }
  // Add more sites as needed
];
/**
 * Render login dialog
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin }: any) => {
  const { surveyId } = useParams<"surveyId">();
  const navigate = useNavigate();
  const [site, setSite] = React.useState(siteList[0].id);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loginError, setLoginError] = React.useState(" ");

  /**
   * Handle site state changes
   */
  const handleSiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSite(event.target.value);
  };
  /**
   * dynamic registration link
   */
  const getRegistrationLink = () => {
    const selectedSite = siteList.find(siteItem => siteItem.id === site);
    if (selectedSite) {
      return selectedSite.url;
    }
    return "";
  };
  /**
   * Handle username state changes
   */
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  /**
   * Handle password state change
   */
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputPassword = event.target.value;
    setPassword(inputPassword);
  };
  /**
   * Validate login
  */
  const validateLogin = (usernameS: string, passwordS: string) => {
    // Perform login validation logic here
    return usernameS.trim() !== "" && passwordS.trim() !== "";
  };
  /**
   * Handle login
   */
  const handleLogin = () => {
    // Perform login validation here
    const isValidLogin = validateLogin(username, password);

    if (isValidLogin) {
      onLogin();
      onClose();
    } else {
      setLoginError(strings.errorHandling.listingScreenLogin.login);
    }
  };

  return (
    <Dialog open={open} onClose={loginError ? undefined : onClose}>
      <DialogTitle>{strings.generic.login}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">{strings.listingScreenLogin.helperText}</FormLabel>
          <RadioGroup
            value={ site }
            onChange={ handleSiteChange }
            row
          >
            {siteList.map(siteItem => (
              <FormControlLabel
                key={ siteItem.id }
                value={ siteItem.id }
                control={ <Radio/> }
                label={ siteItem.name }
              />
            ))}
          </RadioGroup>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label={strings.generic.username}
          type="text"
          fullWidth
          value={username}
          onChange={handleUsernameChange}
          required
        />
        <TextField
          margin="dense"
          label={strings.generic.password}
          type="password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <Typography
          variant="subtitle1"
        >
          { strings.listingScreenLogin.registerText }
          <Typography
            variant="subtitle1"
          >
            <Link
              href={ getRegistrationLink() }
              target="_blank"
              rel="noopener"
            >
              { strings.listingScreenLogin.registerLink }
              {" "}
              { siteList.find(siteItem => siteItem.id === site)?.name }
            </Link>
          </Typography>
        </Typography>
        {loginError && (
          <Typography variant="body2" color="error">
            {loginError}
          </Typography>
        )}
        <DialogActions
          sx={
            {
              justifyContent: "space-between",
              padding: 0,
              marginTop: 1
            }
          }
        >
          <Button
            onClick={ () => navigate(`/surveys/${surveyId}/reusables`) }
            color="primary"
          >
            {strings.generic.cancel}
          </Button>
          <Button
            onClick={handleLogin}
            color="primary"
          >
            {strings.generic.login}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
/**
 * Render the Form / App
 */
const SurveyListingScreen: React.FC = () => {
  const keycloak = useAppSelector(selectKeycloak);
  const errorContext = React.useContext(ErrorContext);
  // const selectedLanguage = useAppSelector(selectLanguage);
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
   * Log out Handle ? future proof
  const handleLogout = () => {
    setLoggedIn(false);
  };
   */
  /**
   * Login Dialog open | future proof?
  const handleOpenDialog = () => {
    setOpen(true);
  };
   */
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
  * Render listing UI
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
            <Typography variant="h1" margin={ 1 } textAlign="center">
              { strings.listingScreen.title }
            </Typography>
            <form onSubmit={ handleSubmit }>
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label="Ilmoituksen otsikko"
                value={ material.componentName }
                disabled
              />
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
              >
                <TextField
                  fullWidth
                  select={ false }
                  color="primary"
                  name="reusableMaterialId"
                  label={ strings.survey.reusables.addNewBuildingPartsDialog.buildingPartOrMaterial }
                  value={ LocalizationUtils.getLocalizedName(reusableMaterials
                    .find(materials => (materials.id === material.reusableMaterialId))?.localizedNames || [], selectedLanguage)}
                  disabled
                />
              </Stack>
              <TextField
                multiline
                rows={ 2 }
                name="description"
                label={ strings.survey.reusables.dataGridColumns.description }
                value={ material.description }
                helperText={ strings.listingScreen.materialInfoHelperText }
                onChange={ e => setMaterialInfo(e.target.value) }
                error={ !!formErrors.materialInfo }
              />
              <Stack
                direction="row"
                spacing={ 2 }
                marginTop={ 2 }
              >
                { /* amounts */ }
                <TextField
                  fullWidth
                  color="primary"
                  name="amount"
                  value={ materialAmount }
                  label={ strings.survey.reusables.dataGridColumns.amount }
                  type="number"
                  onChange={ e => setMaterialAmount(e.target.value) }
                  error={ !!formErrors.materialAmount }
                />
                <TextField
                  fullWidth
                  select={ false }
                  color="primary"
                  name="amount"
                  label={ material.amount }
                  value={ newMaterial.amount }
                  type="tel"
                  onChange={ onNewMaterialChange }
                  disabled
                />
              </Stack>
              <TextField
                fullWidth
                select={ false }
                color="primary"
                name="amount"
                label={ strings.listingScreen.unit }
                value={ material.unit}
                onChange={ onNewMaterialChange }
                disabled
              />
              { /* Location of the material */ }
              <Stack spacing={ 2 } marginTop={ 2 }>
                <TextField
                  fullWidth
                  color="primary"
                  name="componentName"
                  label={ building?.propertyName || "" }
                  value={ propertyName }
                  helperText={ strings.listingScreen.propertyName }
                  onChange={ e => setpropertyName(e.target.value) }
                  error={ !!formErrors.propertyName }
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
                  error={ !!formErrors.address }
                />
                <TextField
                  fullWidth
                  color="primary"
                  name="componentName"
                  label={ `${building?.address?.streetAddress} ${building?.address?.city}`}
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
                  error={ !!formErrors.postalcode }
                />
                <TextField
                  fullWidth
                  color="primary"
                  name="componentName"
                  label={ building?.address?.postCode }
                  type="text"
                  value={ newMaterial.componentName }
                  onChange={ onNewMaterialChange }
                  disabled
                />
              </Stack>
              {/* Contact info */}
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label={ strings.listingScreen.name }
                value={ name }
                onChange={ e => setName(e.target.value) }
                error={ !!formErrors.name }
              />
              { /* tel */ }
              <TextField
                fullWidth
                color="primary"
                name="componentName"
                label={ strings.listingScreen.phone }
                type="tel"
                value={ phone }
                onChange={ e => setPhone(e.target.value) }
                error={ !!formErrors.phone }
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
                error={ !!formErrors.email }
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
        open={open}
        onClose={handleCloseDialog}
        onLogin={handleLogin}
      />
    </Container>
  );
};
export default SurveyListingScreen;