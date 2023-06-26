import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Typography, Link, DialogActions, Button } from "@mui/material";
import strings from "localization/strings";
import { ErrorContext } from "components/error-handler/error-handler";
import { fetchLogin, handleTokenRefresh } from "./handle-listing-login";

/**
 * Dialog interface
 */
interface LoginDialogProps {
  open: boolean;
  onClose: (event: any, reason: any) => void;
  onLogin: () => void;
}
  
/**
 * Interface for the list of sites to send the form to
 */
interface Site {
  id: string;
  name: string;
  url: string;
  token: string;
}

/**
 * List of sites rendered as buttons to select to send the listing form to
 */
const siteList: Site[] = [
  {
    id: "site1", name: "Kiertoon.fi", url: "https://kiertoon.fi/items", token: "https://auth.kiertoon.fi/auth/realms/cityloops/protocol/openid-connect/token"
  }
// Add more sites as needed
];

/**
 * Login Dialog component
 */
const loginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin }) => {
  const navigate = useNavigate();
  const errorContext = React.useContext(ErrorContext);
  const { surveyId } = useParams<{ surveyId: string }>();
  const [ site, setSite ] = React.useState(siteList[0].id);
  const [ username, setUsername ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ loginError, setLoginError ] = React.useState("");
  const [ accessToken, setAccessToken ] = React.useState("");
  const [ refreshToken, setRefreshToken ] = React.useState("");
  const [tokenExpiring, setTokenExpiring] = React.useState(false);

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
   * @param event 
   */
  const handleLogin = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLogin = validateLogin(username, password);
    if (isValidLogin) {
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, error } = await fetchLogin({
        selectedSite: siteList.find(siteItem => siteItem.id === site),
        username: username,
        password: password
      });

      if (error) {
        setLoginError(error);
      } else {
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        onLogin();
        onClose(loginError, undefined);
      }
    } else {
      setLoginError(strings.errorHandling.listingScreenLogin.loginFailed);
    }
  };

  /**
   * Token refresh logic
   */
  const tokenRefresh = async () => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, error } = await handleTokenRefresh({
      selectedSite: siteList.find(siteItem => siteItem.id === site),
      refreshToken: refreshToken
    });
    if (error) {
      errorContext.setError(error);
    } else {
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
    }
  };
  
  // Var for token refresh timer
  let expirationTime = 0;
  /**
   * Check if token is expiring
   * @param token 
   * @returns 
   */
  const isTokenExpiring = (token: any) => {
    if (!token || !token.expires_in) {
      return false;
    }

    if (expirationTime === 0) {
      expirationTime = Math.floor(Date.now() / 1000) + token.expires_in;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const countdown = expirationTime - currentTime;
    const refreshThreshold = 4 * 60; // 4 minutes

    if (countdown <= 0) {
      expirationTime = 0;
      return true;
    }
    if (countdown <= refreshThreshold) {
      expirationTime = currentTime + token.expires_in;
      return true;
    }

    return countdown <= refreshThreshold;
  };

  React.useEffect(() => {
    /**
     * Initialize IsTokenExpiring
     */
    const initializeTokenExpiration = () => {
      if (isTokenExpiring(accessToken)) {
        setTokenExpiring(true);
        expirationTime = 0;
      }
    };
    initializeTokenExpiration();
  });
  
  /**
   * Reset the timer on token expiration time
   */
  React.useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      if (isTokenExpiring(accessToken)) {
        setTokenExpiring(true);
        expirationTime = 0;
      }
    }, 3 * 60 * 1000);

    return () => {
      clearTimeout(refreshTimeout);
    };
  }, [accessToken]);

  /**
   * Check if token is expiring --> refresh token || false
   */
  React.useEffect(() => {
    if (tokenExpiring) {
      tokenRefresh();
      setTokenExpiring(false);
    }
  }, [tokenExpiring]);

  /**
   * TEMPORARY SKIP LOGIN, DELETE WHEN FORM UI is 100% done
   */
  const skipLoginTemp = () => {
    onLogin();
    onClose(loginError, undefined);
  };

  /*
   * Login Dialog render
   */
  return (
    <Dialog
      open={ open }
      disableEscapeKeyDown={true}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          onClose(event, reason);
        }
      }
      }
    >
      <DialogTitle>{ strings.listingScreenLogin.title }</DialogTitle>
      <DialogContent>
        <form onSubmit={ handleLogin }>
          <FormControl component="fieldset">
            <FormLabel component="legend">{ strings.listingScreenLogin.helperText }</FormLabel>
            <RadioGroup
              value={ site }
              onChange={ handleSiteChange }
              row={ true }
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
          </Typography>
          <Typography variant="subtitle1">
            <Link href={getRegistrationLink()} target="_blank" rel="noopener">
              { strings.listingScreenLogin.registerLink }
              {" "}
              { siteList.find(siteItem => siteItem.id === site)?.name }
            </Link>
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
            {/* SKIP BUTTON FOR LOGIN TEMPORARY, DELETE WHEN FORM UI 100% DONE */}
            <Button onClick={skipLoginTemp}> SKIP LOGIN TEMP </Button>
            <Button type="submit" color="primary">
              { strings.generic.login }
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default loginDialog;