import strings from "localization/strings";

/**
 * Interface for site props
 */
interface Site {
  id: string;
  name: string;
  url: string;
  token: string;
}

/**
 * Interface for login params from login-dialog.tsx
 */
interface LoginParams {
  selectedSite: Site | undefined;
  username: string;
  password: string;
}

/**
 * Interface for refreshing token on login-dialog.tsx side
 */
interface tokenParams {
  selectedSite: Site | undefined;
  refreshToken: string;
}

/**
 * Main component to handle 3rd party login
 * @param params 
 * @returns 
 */
const fetchLogin = async (params: LoginParams): Promise<{ accessToken: string; refreshToken: string; error: string }> => {
  const { selectedSite, username, password } = params;
  let accessToken = "";
  let refreshToken = "";
  let error = "";
  
  if (selectedSite && selectedSite.name === "Kiertoon.fi") {
    try {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.append("username", username);
      urlSearchParams.append("password", password);
      urlSearchParams.append("client_id", "management");
      urlSearchParams.append("grant_type", "password");
  
      const response = await fetch(selectedSite.token, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlSearchParams.toString()
      });
  
      if (response.ok) {
        const data = await response.json();
        accessToken = data;
        refreshToken = data.refresh_token;
      } else if (response.status === 401) {
        error = strings.errorHandling.listingScreenLogin.loginFailed;
      } else {
        error = strings.errorHandling.listingScreenLogin.serverError;
      }
    } catch (e) {
      error = strings.errorHandling.listingScreenLogin.serverError;
    }
  } else {
    error = strings.errorHandling.listingScreenLogin.loginFailed;
  }
  
  return {
    accessToken: accessToken, refreshToken: refreshToken, error: error
  };
};

/**
 * Handle 3rd party token refresh
 */
const handleTokenRefresh = async (params: tokenParams): Promise<{ accessToken: string; refreshToken: string; error: string }> => {
  const { selectedSite, refreshToken } = params;
  let accessToken = "";
  let token = refreshToken || "";
  let error = "";

  if (selectedSite && selectedSite.name === "Kiertoon.fi") {
    try {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.append("grant_type", "refresh_token");
      urlSearchParams.append("refresh_token", refreshToken);
      urlSearchParams.append("client_id", "management");
      const response = await fetch(selectedSite.token, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: urlSearchParams.toString()
      });
  
      if (response.ok) {
        const data = await response.json();
        accessToken = data;
        token = data.refresh_token;
      } else if (response.status === 401) {
        error = strings.errorHandling.listingScreenLogin.loginFailed;
      } else {
        error = strings.errorHandling.listingScreenLogin.serverError;
      }
    } catch (e) {
      error = strings.errorHandling.listingScreenLogin.serverError;
    }
  } else {
    error = strings.errorHandling.listingScreenLogin.loginFailed;
  }
  
  return {
    accessToken: accessToken, refreshToken: token, error: error
  };
};

export { fetchLogin, handleTokenRefresh };