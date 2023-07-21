import React, { useState, useEffect } from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import strings from "localization/strings";
import { ErrorContext } from "components/error-handler/error-handler";

/**
 * Handles material categories from the 3rd party site
 * 
 * @returns material categories from 3rd party site
 */
const CategorySelect = ({ accessToken, selectedSite, categoryError, onCategorySelect }: any) => {
  const [ categories, setCategories ] = useState<Array<any>>([]);
  const [ selectedCategory, setSelectedCategory ] = useState("");
  const errorContext = React.useContext(ErrorContext);

  /**
   * Fetch categories from 3rd party site
   */
  const fetchCategories = async () => {
    if (selectedSite.name === "Kiertoon.fi") {
      try {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append("grant_type", "refresh_token");
        urlSearchParams.append("access_token", accessToken);
        urlSearchParams.append("client_id", "management");
    
        const response = await fetch("https://api.kiertoon.fi/v1/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken.access_token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          errorContext.setError(strings.errorHandling.listingScreen.category);
        }
      } catch (error) {
        errorContext.setError(strings.errorHandling.listingScreen.category, error);
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Handle category  
   *
   * @param event Handle select
   */
  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);
    onCategorySelect(selectedValue);
  };

  return (

    <FormControl
      fullWidth
    >
      <InputLabel id="category-helper-text" error={ !!categoryError }>{ strings.listingScreen.categorySelect }</InputLabel>
      <Select
        value={ selectedCategory }
        onChange={ handleSelectChange }
        label="Age"
        labelId="category-select-label"
        error={ !!categoryError }
        fullWidth
      >
        <MenuItem value=""/>
        {categories.map(category => (
          <MenuItem key={ category.id } value={ category.id }>
            { category.name }
          </MenuItem>
        ))}
      </Select>
    </FormControl>

  );
};

export default CategorySelect;