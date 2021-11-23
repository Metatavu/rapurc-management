import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Localized strings
 */
export interface Localized extends LocalizedStringsMethods {

  /**
   * App title translation
   */
  appTitle: string;

  /**
   * Translations related to generic words
   */
  generic: {
    addNew: string;
    notImplemented: string;
    confirm: string;
    cancel: string;
    delete: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    title: string;
    missingAccessToken: string;
    surveys: {
      list: string;
      create: string;
      find: string;
      update: string;
      delete: string;
    };
    buildings: {
      list: string;
    };
    owners: {
      list: string;
      create: string;
      update: string;
    };
    materials: {
      list: string;
      create: string;
      delete: string;
      update: string;
    };
    postProcess: {
      list: string;
      create: string;
      delete: string;
    };
    wasteSpecifiers: {
      list: string;
      create: string;
      delete: string;
    };
    wasteCategories: {
      list: string;
      create: string;
      delete: string;
    };
    wasteMaterials: {
      list: string;
      create: string;
      delete: string;
    };
  };

  /**
   * Translations related to navigation
   */
  navigation: {
    surveys: string;
    newSurvey: string;
    admin: string;
  };

  /**
   * Translations related to surveys screen
   */
  surveysScreen: {
    title: string;
    description: string;
    address: string;
    showAll: string;
    showMine: string;
    newSurvey: string;
    filter: string;
    dataGridColumns: {
      buildingId: string;
      classificationCode: string;
      ownerName: string;
      city: string;
      streetAddress: string;
    };
    deleteSurveysDialog: {
      title: string;
      text: string;
    };
  };

  /**
   * Translations related to create new survey screen
   */
  newSurveyScreen: {
    title: string;
    description: string;
    address: string;
    propertyId: string;
    buildingId: string;
    search: string;
    createManually: string;
    createSurvey: string;
  };

  /**
   * Translations related to create new survey screen
   */
  surveyScreen: {
    title: string;
    status: string;
    navigation: {
      owner: string;
      building: string;
      otherStructures: string;
      info: string;
      reusables: string;
      waste: string;
      hazardous: string;
      attachments: string;
      summary: string;
    }
  };

  /**
   * Translations related to admin screen
   */
  adminScreen: {
    title: string;
    description: string;
    navigation: {
      dropdownSettings: {
        title: string;
        reusableMaterials: string;
        wasteMaterials: string;
        postProcessing: string;
        hazardousMaterials: string;
        hazardousMaterialsAdditionalInfo: string;
      }
    }
    addNewReusableMaterialDialog: {
      title: string;
      text: string;
    }
    deleteReusableMaterialDialog: {
      title: string;
      text: string;
    },
    updateReusableMaterialDialog: {
      title: string;
      text: string;
    },
    addNewPostProcessDialog: {
      title: string;
      text: string;
    }
    deletePostProcessDialog: {
      title: string;
      text: string;
    },
    addNewWasteSpecifierDialog: {
      title: string;
      text: string;
    }
    deleteWasteSpecifierDialog: {
      title: string;
      text: string;
    },
    addNewWasteCategoryDialog: {
      title: string;
      text1: string;
      text2: string;
    }
    deleteWasteCategoryDialog: {
      title: string;
      text: string;
    },
    addNewWasteMaterialDialog: {
      title: string;
      text1: string;
      text2: string;
    }
    deleteWasteMaterialDialog: {
      title: string;
      text: string;
    }
  };

  /**
   * Translations related to surveys
   */
  survey: {
    surveyStatus: {
      draft: string;
      done: string;
    };
    owner: {
      title: string;
      name: string;
      tradeName: string;
      contactPerson: string;
      firstName: string;
      surname: string;
      occupation: string;
      phone: string;
      email: string;
    }
  }
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;