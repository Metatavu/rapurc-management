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
interface TokenParams {
  selectedSite: Site | undefined;
  refreshToken: string;
}

/**
 * Interface for AuthenticationResponse
 */
interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  error: string;
}

/**
 * Main component to handle 3rd party login. This authentication currently only supports kiertoon.fi-site login.
 *
 * @param params 
 * @returns 
 */
const authenticate = async (params: LoginParams): Promise<AuthenticationResponse> => {
  const { selectedSite, username, password } = params;

  if (!selectedSite || selectedSite.name !== "Kiertoon.fi") {
    throw new Error(strings.errorHandling.listingScreenLogin.loginFailed);
  }

  try {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("username", username);
    urlSearchParams.append("password", password);
    urlSearchParams.append("client_id", "management");
    urlSearchParams.append("grant_type", "password");

    const response = await fetch(selectedSite.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlSearchParams.toString()
    });

    if (!response.ok) {
      return {
        accessToken: "",
        refreshToken: "",
        error:
          response.status === 401
            ? strings.errorHandling.listingScreenLogin.loginFailed
            : strings.errorHandling.listingScreenLogin.serverError
      };
    }

    const data = await response.json();

    return {
      accessToken: data,
      refreshToken: data.refresh_token,
      error: ""
    };
  } catch (error) {
    return {
      accessToken: "",
      refreshToken: "",
      error: typeof error === "string" ? error : strings.errorHandling.listingScreenLogin.serverError
    };
  }
};

/**
 * Handle 3rd party token refresh
 */
const refreshAuthentication = async (params: TokenParams): Promise<AuthenticationResponse> => {
  const { selectedSite, refreshToken } = params;

  if (!selectedSite || selectedSite.name !== "Kiertoon.fi") {
    throw new Error(strings.errorHandling.listingScreenLogin.loginFailed);
  }

  try {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("grant_type", "refresh_token");
    urlSearchParams.append("refresh_token", refreshToken);
    urlSearchParams.append("client_id", "management");

    const response = await fetch(selectedSite.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: urlSearchParams.toString()
    });

    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? strings.errorHandling.listingScreenLogin.loginFailed
          : strings.errorHandling.listingScreenLogin.serverError
      );
    }

    const data = await response.json();

    return {
      accessToken: data,
      refreshToken: data.refresh_token,
      error: ""
    };
  } catch (error) {
    return {
      accessToken: "",
      refreshToken: "",
      error: typeof error === "string" ? error : strings.errorHandling.listingScreenLogin.serverError
    };
  }
};

export { authenticate, refreshAuthentication };