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
  created?: Date;
  userId?: string;
  access_token?: string;
  refresh_token?: string;
  refresh_expires_in?: number;
}

/**
 * interface for params itemdata
 */
interface ItemData {
  title: string;
  category: string;
  address: string;
  email: string;
  phone: string;
  description: string;
  unit: "KG" | "TN" | "M2" | "M3" | "PCS";
  amount: number;
  price: number;
}

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

/**
 * Handle material unit type and update itemData properties accordingly
 * Change material unit type to match Kiertoon.fi specification
 * 
 * @param data 
 * @param itemData 
 */
const handleMaterialUnit = (data: any, itemData: Item) => {
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
};

/**
 * Create new listing item to kiertoon.fi
 * 
 * @param data 
 * @param token 
 * @param handleItemCreationSuccess 
 * @param setErrorHandler 
 */
const createItem = async (
  data: ItemData,
  token: string,
  handleItemCreationSuccess: (itemId: string) => void,
  setErrorHandler: (title: string, errorMessage: string) => void
) => {
  const decodedToken = buildToken(token);
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
    images: [],
    properties: [{ key: "Lisätiedot", value: data.description || "" }],
    userId: decodedToken.userId || "",
    price: data.price || 0,
    priceUnit: "EURO" || "", // Assuming the price unit is always EURO
    paymentMethod: "",
    delivery: false,
    itemType: "SELL" // Assuming the itemType is always 'SELL'
  };

  /**
   * Change material unit type to match Kiertoon.fi specification
   */
  handleMaterialUnit(data, itemData);

  /**
   * Post data to kiertoon.fi
   */
  try {
    const response = await fetch("https://api.kiertoon.fi/v1/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodedToken.access_token}`
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