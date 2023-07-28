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
  unit: "RM" | "KG" | "TN" | "M2" | "M3" | "PCS";
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
 * Get item properties
 * 
 * @param data item data
 * @returns properties 
 */
const getItemProperties = (data: ItemData) => {
  const { unit, amount, description } = data;
  const properties: { key: string; value: string }[] = [];
  const unitAmountString = `${amount} ${unit}`;

  switch (unit) {
    case "RM":
      properties.push({ key: "Pituus", value: unitAmountString });
      break;
    case "KG":
      properties.push({ key: "Paino", value: unitAmountString });
      break;
    case "TN":
      properties.push({ key: "Paino", value: unitAmountString });
      break;
    case "M2":
      properties.push({ key: "Tilavuus", value: unitAmountString });
      break;
    case "M3":
      properties.push({ key: "Tilavuus", value: unitAmountString });
      break;
    case "PCS":
      properties.push({ key: "Määrä", value: `${amount} KPL` });
      break;
    default:
      break;
  }

  properties.push({ key: "Lisätiedot", value: description || "" });

  return properties;
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
  const { title = "", category = "", address = "", email = "", phone = "", price = 0 } = data;
  const itemData: Item = {
    title: title ?? "",
    expired: false,
    category: category ?? "",
    onlyForCompanies: false,
    metadata: {
      locationInfo: {
        address: address ?? "",
        email: email ?? "",
        phone: phone ?? ""
      }
    },
    images: [],
    properties: getItemProperties(data),
    userId: decodedToken.userId ?? "",
    price: price ?? 0,
    priceUnit: "EURO", // Assuming the price unit is always EURO
    paymentMethod: "",
    delivery: false,
    itemType: "SELL" // Assuming the itemType is always 'SELL'
  };

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