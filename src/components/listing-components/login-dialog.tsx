import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Typography, Link, DialogActions, Button } from "@mui/material";
import strings from "localization/strings";
import { ErrorContext } from "components/error-handler/error-handler";
import { authenticate, refreshAuthentication } from "./authentication-utils";

/**
 * Dialog interface
 */
interface LoginDialogProps {
  open: boolean;
  onClose: (reason: string) => void;
  onLogin: () => void;
  onAccessTokenUpdate: (accessToken: string) => void;
  loggedSite: (loggedSite: any) => void;
}
  
/**
 * Interface for the list of sites to send the form to
 */
interface Site {
  id: string;
  name: string;
  url: string;
  item: string;
  token: string;
}

/**
 * List of sites rendered as buttons to select to send the listing form to
 */
const siteList: Site[] = [
  {
    id: "site1",
    name: "Kiertoon.fi",
    url: "https://kiertoon.fi/items",
    item: "https://kiertoon.fi/item",
    token: "https://auth.kiertoon.fi/auth/realms/cityloops/protocol/openid-connect/token"
  }
// Add more sites as needed
];

/**
 * Login Dialog component
 */
const loginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin, onAccessTokenUpdate, loggedSite }) => {
  const navigate = useNavigate();
  const errorContext = React.useContext(ErrorContext);
  const { surveyId } = useParams<{ surveyId: string }>();
  const [ site, setSite ] = React.useState(siteList[0].id);
  const [ username, setUsername ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ loginError, setLoginError ] = React.useState("");
  const [ accessToken, setAccessToken ] = React.useState("");
  const [ refreshToken, setRefreshToken ] = React.useState("");
  const [ tokenTimestamp, setTokenTimestamp ] = React.useState(0);

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
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, error } = await authenticate({
        selectedSite: siteList.find(siteItem => siteItem.id === site),
        username: username,
        password: password
      });

      if (error) {
        setLoginError(error);
      } else {
        setAccessToken(newAccessToken);
        onAccessTokenUpdate(newAccessToken);
        setRefreshToken(newRefreshToken);
        setTokenTimestamp(Math.floor(Date.now() / 1000));
        loggedSite(siteList.find(siteItem => siteItem.id === site));
        onLogin();
        onClose(loginError);
      }
    } else {
      setLoginError(strings.errorHandling.listingScreenLogin.loginFailed);
    }
  };

  /**
   * Token refresh logic
   */
  const tokenRefresh = async () => {
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, error } = await refreshAuthentication({
      selectedSite: siteList.find(siteItem => siteItem.id === site),
      refreshToken: refreshToken
    });
    if (error) {
      errorContext.setError(error);
    } else {
      setRefreshToken(newRefreshToken);
      setTokenTimestamp(Math.floor(Date.now() / 1000));
      setAccessToken(newAccessToken);
    }
  };

  /**
   * Check if the access token is expiring
   *
   * @param token The access token object
   * @returns True if the access token is expiring, false otherwise
   */
  const isTokenExpiring = (token: any) => {
    if (!token || !token.expires_in) {
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expirationTime = tokenTimestamp + token.expires_in;
    const refreshThreshold = 4 * 60; // 4 minutes
  
    return expirationTime - currentTime <= refreshThreshold;
  };
  
  /**
   * Custom hook for running given callback function in intervals
   *
   * @param callback callback function
   * @param interval interval as milliseconds
   */
  const useInterval = (callback: () => any, interval: number) => {
    const savedCallback = React.useRef<typeof callback>();

    React.useEffect(() => {
      savedCallback.current = callback;
    });

    React.useEffect(() => {
      /**
       * Excecute callback function, if it exists.
       */
      const tick = () => {
        savedCallback.current?.();
      };

      const timeout = setInterval(tick, interval);
      return () => clearInterval(timeout);
    }, [interval]);
  };

  /**
   * Check token expiration and refresh if needed
   */
  const checkTokenExpiration = () => {
    if (isTokenExpiring(accessToken)) {
      tokenRefresh();
    }
  };

  // Run the token expiration check every 4 minutes
  useInterval(checkTokenExpiration, 4 * 60 * 1000);

  /**
   * Handle cancel btn
   */
  const handleCancel = () => {
    navigate(`/surveys/${surveyId}/reusables`);
  };

  /**
   * Login Dialog render
   */
  return (
    <Dialog
      open={ open }
      disableEscapeKeyDown
      onClose={ (_, reason) => reason !== "backdropClick" && onClose(reason) }
    >
      <DialogTitle>{ strings.listingScreenLogin.title }</DialogTitle>
      <DialogContent>
        <form onSubmit={ handleLogin }>
          <FormControl component="fieldset">
            <FormLabel component="legend">{ strings.listingScreenLogin.helperText }</FormLabel>
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
              {`${strings.listingScreenLogin.registerLink} ${siteList.find(siteItem => siteItem.id === site)?.name ?? ""}`}
            </Link>
          </Typography>
          {loginError && (
            <Typography variant="body2" color="error">
              { loginError }
            </Typography>
          )}
          <DialogActions
            sx={{
              justifyContent: "space-between",
              padding: 0,
              marginTop: 1
            }}
          >
            <Button onClick={ handleCancel } color="primary">
              { strings.generic.cancel }
            </Button>
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