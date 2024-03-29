import { Configuration, SurveysApi, BuildingsApi, OwnersApi, ReusableMaterialApi, SurveyReusablesApi, BuildingTypesApi, SurveyorsApi, SurveyWastesApi, UsagesApi, WasteMaterialApi, WasteCategoryApi, WasteSpecifiersApi, HazardousMaterialApi, SurveyHazardousWastesApi, SurveyAttachmentsApi, UserGroupsApi, EmailsApi, GroupJoinInvitesApi, GroupJoinRequestsApi } from "../generated/client";

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {

  /**
   * Gets initialized waste category API
   *
   * @param accessToken access token
   * @returns initialized waste category API
   */
  public static getWasteCategoryApi = (accessToken: string) => {
    return new WasteCategoryApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized waste material API
   *
   * @param accessToken access token
   * @returns initialized waste material API
   */
  public static getWasteMaterialApi = (accessToken: string) => {
    return new WasteMaterialApi(Api.getConfiguration(accessToken));
  };

  /*
   * Gets initialized usages API
   *
   * @param accessToken access token
   * @returns initialized usages API
   */
  public static getUsagesApi = (accessToken: string) => {
    return new UsagesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized building types API
   *
   * @param accessToken access token
   * @returns initialized building types API
   */
  public static getBuildingTypesApi = (accessToken: string) => {
    return new BuildingTypesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized surveyReusables API
   *
   * @param accessToken access token
   * @returns initialized surveys API
   */
  public static getSurveyReusablesApi = (accessToken: string) => {
    return new SurveyReusablesApi(Api.getConfiguration(accessToken));
  };

  /*
   * Gets initialized reusable materials API
   *
   * @param accessToken access token
   * @returns initialized reusable materials API
   */
  public static getReusableMaterialApi = (accessToken: string) => {
    return new ReusableMaterialApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized surveys API
   *
   * @param accessToken access token
   * @returns initialized surveys API
   */
  public static getSurveysApi = (accessToken: string) => {
    return new SurveysApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized buildings API
   *
   * @param accessToken access token
   * @returns initialized buildings API
   */
  public static getBuildingsApi = (accessToken: string) => {
    return new BuildingsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized owners API
   *
   * @param accessToken access token
   * @returns initialized owners API
   */
  public static getOwnersApi = (accessToken: string) => {
    return new OwnersApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized surveyors API
   *
   * @param accessToken access token
   * @returns initialized surveyors API
   */
  public static getSurveyorsApi = (accessToken: string) => {
    return new SurveyorsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized wastes API
   *
   * @param accessToken access token
   * @returns initialized wastes API
   */
  public static getWastesApi = (accessToken: string) => {
    return new SurveyWastesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized waste specifiers API
   *
   * @param accessToken access token
   * @returns initialized waste specifiers API
   */
  public static getWasteSpecifiersApi = (accessToken: string) => {
    return new WasteSpecifiersApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized usages API
   *
   * @param accessToken access token
   * @returns initialized usages API
   */
  public static getUsageApi = (accessToken: string) => {
    return new UsagesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized hazardous material API
   *
   * @param accessToken access token
   * @returns initialized hazardous materialsAPI
   */
  public static getHazardousMaterialApi = (accessToken: string) => {
    return new HazardousMaterialApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized hazardous waste API
   *
   * @param accessToken access token
   * @returns initialized waste materialsAPI
   */
  public static getHazardousWasteApi = (accessToken: string) => {
    return new SurveyHazardousWastesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized attachments API
   *
   * @param accessToken access token
   * @returns initialized waste attachments API
   */
  public static getAttachmentsApi = (accessToken: string) => {
    return new SurveyAttachmentsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized user groups API
   *
   * @param accessToken access token
   * @returns initialized user groups API
   */
  public static getUserGroupsApi = (accessToken: string) => {
    return new UserGroupsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized group join invites API
   *
   * @param accessToken access token
   * @returns initialized group join invites API
   */
  public static getGroupJoinInvitesApi = (accessToken: string) => {
    return new GroupJoinInvitesApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets initialized group join requests API
   *
   * @param accessToken access token
   * @returns initialized group join requests API
   */
  public static getGroupJoinRequestsApi = (accessToken: string) => {
    return new GroupJoinRequestsApi(Api.getConfiguration(accessToken));
  };
  
  /**
   * Gets initialized emails API
   *
   * @param accessToken access token
   * @returns initialized emails API
   */
  public static getEmailsApi = (accessToken: string) => {
    return new EmailsApi(Api.getConfiguration(accessToken));
  };

  /**
   * Gets api configuration
   *
   * @returns new configuration
   */
  private static getConfiguration(accessToken: string) {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

}