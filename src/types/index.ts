import { Building, BuildingType, HazardousMaterial, HazardousWaste, OwnerInformation, Reusable, ReusableMaterial, Surveyor, SurveyStatus, Usage, Waste, WasteCategory, WasteMaterial, WasteSpecifier } from "generated/client";
import { Attachment } from "../generated/client/models/Attachment";

/**
 * Application configuration
 */
export interface Configuration {
  auth: {
    url: string;
    realm: string;
    clientId: string;
  };
  api: {
    baseUrl: string;
  };
  files: {
    uploadPath: string
  }
}

/**
 * Survey with info
 */
export interface SurveyWithInfo {
  id: string;
  status: SurveyStatus;
  ownerId?: string;
  ownerName?: string;
  propertyName?: string;
  buildingId?: string;
  classificationCode?: string;
  streetAddress?: string;
  city?: string;
  creatorId?: string;
}

/**
 * Generic dataGrid row
 */
export interface GenericDataGridRow {
  id?: string;
}

/**
 * Error context type
 */
export type ErrorContextType = {
  error?: string;
  setError: (message: string, error?: any) => void;
};

/**
 * Pre-signed POST data for uploading images to S3
 */
export interface PreSignedPostData {
  url: string;
  fields: Record<string, string>;
}

/**
 * Pre-signed POST data response from S3
 */
export type PreSignedPostDataResponse =
  { error: false; basePath: string; data: PreSignedPostData; } |
  { error: true; message: string; };

/**
 * Interface for upload data
 */
export interface UploadData {
  xhrRequest: XMLHttpRequest;
  uploadUrl: string;
  key: string;
  formData: FormData;
  cdnBasePath: string;
  fileType: string;
}

/**
 * Interface for upload file
 */
export interface UploadFile {
  imageUrl?: string;
  file?: File;
  progress: number
}

/**
 * Interface for survey summary
 */
export interface SurveySummary {
  building?: Building;
  buildingTypes: BuildingType[];
  ownerInformation?: OwnerInformation;
  reusables: Reusable[];
  reusableMaterials: ReusableMaterial[];
  wastes: Waste[];
  wasteCategories: WasteCategory[];
  wasteMaterials: WasteMaterial[];
  wasteSpecifiers: WasteSpecifier[];
  hazardousWastes: HazardousWaste[];
  hazardousMaterials: HazardousMaterial[];
  usages: Usage[];
  surveyors: Surveyor[];
  attachments: Attachment[];
}

export interface CheckboxData {
  name: string;
  checked: boolean;
}

/**
 * Interface for survey summary
 */
export enum SurveyShow {
  ShowAll = "showAll",
  ShowMine = "showMine"
}

/**
 * Enum for group dialog status
 */
export enum GroupDialogStatus {
  WELCOME = "welcome",
  CREATE = "create",
  INVITE = "invite",
  CREATE_DONE = "create done",
  JOIN = "join",
  REQUEST_SENT = "request sent"
}