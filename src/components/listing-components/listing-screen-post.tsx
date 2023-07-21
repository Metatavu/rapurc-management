import jwt_decode from "jwt-decode";

/**
 * Interface for POST item
 */
interface Item {
  title: string;
  expired: boolean;
  category: string;
  onlyForCompanies: boolean,
  metadata: { locationInfo: { phone: string; address: string } };
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
const createItem = async (data: any, refreshToken: any) => {
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
        phone: data.phone || "",
        address: data.address || ""
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
    console.log("Item created:", responseData);
  } catch (error) {
    console.error("Error creating item:", error);
  }
};
  
export default createItem;