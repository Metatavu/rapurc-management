import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Typography, Link, DialogActions, Button } from "@mui/material";
import strings from "localization/strings";

/**
 * Dialog interface
 */
interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}
  
/**
  * Interface for the list of sites to send the form to
 */
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
  }
// Add more sites as needed
];

/**
 * Login Dialog component
 */
const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin }) => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [ site, setSite ] = useState(siteList[0].id);
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ loginError, setLoginError ] = useState("");

  /**
   * Handle state change in choosing the site
   */
  const handleSiteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSite(event.target.value);
  };

  /**
   * Get registeration link from site list for dynamic link
   */
  const getRegistrationLink = () => {
    const selectedSite = siteList.find(siteItem => siteItem.id === site);
    if (selectedSite) {
      return selectedSite.url;
    }
    return "";
  };
  
  /**
   * Handle login username input changes
   */
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  /**
   * Handle password input changes
   */
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  /**
   * Validate login inputs
   */
  const validateLogin = (usernameS: string, passwordS: string) => {
    return usernameS.trim() !== "" && passwordS.trim() !== "";
  };
  
  /**
   * Handle login
   */
  const handleLogin = () => {
    const isValidLogin = validateLogin(username, password);
  
    if (isValidLogin) {
      onLogin();
      onClose();
    } else {
      setLoginError(strings.errorHandling.listingScreenLogin.login);
    }
  };

  /* 
  //Log out Handle ? future proof
  const handleLogout = () => {
    setLoggedIn(false);
  };

  //Login Dialog open | future proof
  const handleOpenDialog = () => {
    setOpen(true);
  };
  */

  /**
   * Login Dialog render
   */
  return (
    <Dialog open={ open } onClose={ loginError ? undefined : onClose }>
      <DialogTitle>{ strings.listingScreenLogin.title }</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">{ strings.listingScreenLogin.helperText }</FormLabel>
          <RadioGroup value={ site } onChange={ handleSiteChange } row>
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
          label={ strings.generic.username }
          type="text"
          fullWidth
          value={ username }
          onChange={ handleUsernameChange }
          required
        />
        <TextField
          margin="dense"
          label={ strings.generic.password }
          type="password"
          fullWidth
          value={ password }
          onChange={ handlePasswordChange }
          required
        />
        <Typography variant="subtitle1">
          { strings.listingScreenLogin.registerText }
          <Typography variant="subtitle1">
            <Link href={getRegistrationLink()} target="_blank" rel="noopener">
              { strings.listingScreenLogin.registerLink }
              {" "}
              { siteList.find(siteItem => siteItem.id === site)?.name }
            </Link>
          </Typography>
        </Typography>
        {loginError && (
          <Typography variant="body2" color="error">
            { loginError }
          </Typography>
        )}
        <DialogActions sx={{
          justifyContent: "space-between", padding: 0, marginTop: 1
        }}
        >
          <Button onClick={() => navigate(`/surveys/${surveyId}/reusables`)} color="primary">
            { strings.generic.cancel }
          </Button>
          <Button onClick={handleLogin} color="primary">
            { strings.generic.login }
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
  
export default LoginDialog;