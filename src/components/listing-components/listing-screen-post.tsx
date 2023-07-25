import jwt_decode from "jwt-decode";
import strings from "localization/strings";

/**
 * Interface for POST item
 */
interface Item {
  title: string;
  expired: boolean;
  category: string;
  onlyForCompanies: boolean,
  metadata: { locationInfo: { phone: string; address: string; email: string; } };
  images?: string[];
  properties?: { key: string; value: string }[];
  userId: string,
  price: number;
  priceUnit: string;
  paymentMethod: string,
  delivery: boolean,
  itemType: "SELL";
}

/**
 * Interface representing a decoded access token
 */
interface DecodedAccessToken {
  sub?: string;
  given_name?: string;
  family_name?: string;
}

/**
 * POST listing screen form data
 * 
 * @param itemData 
 */
const createItem = async (
  data: any, refreshToken: any,
  handleItemCreationSuccess: (itemId: string) => void,
  setErrorHandler: (title: string, errorMessage: string) => void) => {
  /**
   * Builds access token object from login data
   *
   * @param tokenData token data
   * @returns access token
   */
  const buildToken = (tokenData: any) => {
    const decodedToken: DecodedAccessToken = jwt_decode(tokenData.access_token);
    const created = new Date();

    return {
      created: created,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      refresh_expires_in: tokenData.refresh_expires_in,
      userId: decodedToken.sub
    };
  };
  const user = buildToken(refreshToken);
  const itemData: Item = {
    title: data.title || "",
    expired: false,
    category: data.category || "",
    onlyForCompanies: false,
    metadata: {
      locationInfo: {
        address: data.address || "",
        email: data.email || "",
        phone: data.phone || ""
      }
    },
    images: data.blob ? [data.blob] : [],
    properties: [
      { key: "Lisätiedot", value: data.description || "" }
    ],
    userId: user.userId || "",
    price: data.price || 0,
    priceUnit: "EURO" || "", // Assuming the price unit is always EURO
    paymentMethod: "",
    delivery: false,
    itemType: "SELL" // Assuming the itemType is always 'SELL'
  };
  /**
   * Check material unit type and change according to Kiertoo settings
   */
  if (data.unit === "KG") {
    itemData.properties?.push({ key: "Paino", value: `${data.amount} ${data.unit}` });
  } else if (data.unit === "TN") {
    itemData.properties?.push({ key: "Paino", value: `${data.amount} ${data.unit}` });
  } else if (data.unit === "M2") {
    itemData.properties?.push({ key: "Tilavuus", value: `${data.amount} ${data.unit}` });
  } else if (data.unit === "M3") {
    itemData.properties?.push({ key: "Tilavuus", value: `${data.amount} ${data.unit}` });
  } else if (data.unit === "PCS") {
    itemData.properties?.push({ key: "Määrä", value: `${data.amount} KPL` });
  }

  /**
   * Post data to kiertoon.fi
   */
  try {
    const response = await fetch("https://api.kiertoon.fi/v1/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken.access_token}`
      },
      body: JSON.stringify(itemData)
    });

    const responseData = await response.json();
    handleItemCreationSuccess(responseData.id);
  } catch (error) {
    setErrorHandler(strings.errorHandling.listingScreen.submit, (error as Error).message);
  }
};
  
export default createItem;