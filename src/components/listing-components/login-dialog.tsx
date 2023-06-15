import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Typography, Link, DialogActions, Button } from "@mui/material";
import strings from "localization/strings";

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
 * list of sites rendered as buttons to select to send the listing form to
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
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const [ site, setSite ] = React.useState(siteList[0].id);
  const [ username, setUsername ] = React.useState("");
  const [ password, setPassword ] = React.useState("");
  const [ loginError, setLoginError ] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");
  const [refreshToken, setRefreshToken] = React.useState("");
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
   * Get site Token fetch url
   */
  const getTokenSiteUrl = () => {
    const selectedSite = siteList.find(siteItem => siteItem.id === site);
    if (selectedSite) {
      return selectedSite.token;
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
  const handleLogin = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidLogin = validateLogin(username, password);
    if (isValidLogin) {
      try {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("username", username);
        urlSearchParams.append("password", password);
        urlSearchParams.append("client_id", "management");
        urlSearchParams.append("grant_type", "password");
        const response = await fetch(getTokenSiteUrl(), {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "",
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: urlSearchParams.toString()
        });
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data);
          // console.log("Login successful:", data);
          setRefreshToken(data.refresh_token);
          onLogin();
          onClose(loginError, undefined);
        } else {
          setLoginError(strings.errorHandling.listingScreenLogin.loginFailed);
        }
      } catch (error) {
        //  console.error("error: ", error);
      }
    } else {
      setLoginError(strings.errorHandling.listingScreenLogin.loginFailed);
    }
  };
  /**
   * Token refresh logic
   */
  const handleTokenRefresh = async () => {
    try {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.append("grant_type", "refresh_token");
      urlSearchParams.append("refresh_token", refreshToken);
      urlSearchParams.append("client_id", "management");
      const response = await fetch(getTokenSiteUrl(), {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlSearchParams.toString()
      });
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data);
        setRefreshToken(data.refresh_token);
        // console.log("Token refreshed:", data.refresh_token);
      } else {
        // console.log("Token refresh failed");
      }
    } catch (error) {
      // console.error("Error refreshing token:", error);
    }
  };
  /**
   * Check if token is expiring
   * @param token 
   * @returns 
   */
  const isTokenExpiring = (token: any) => {
    if (!token || !token.expires_in) {
      return false; // Token or expiration time not available
    }
    const expirationTime = new Date(token.expires_in).getTime();
    const currentTime = new Date().getTime();

    // Set the threshold time before expiration for refreshing the token (in milliseconds)
    const refreshThreshold = 4 * 60 * 1000; // 4 minutes
  
    // Check if the token is expiring within the refresh threshold
    return expirationTime - currentTime < refreshThreshold;
  };
  React.useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      if (isTokenExpiring(accessToken)) {
        handleTokenRefresh();
      }
    }, 4 * 60 * 1000); // Refresh the token 4 minutes before expiration
  
    return () => {
      clearTimeout(refreshTimeout);
    };
  }, [accessToken, refreshToken]); // Add refreshToken as a dependency here  

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
        <form onSubmit={handleLogin}>
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