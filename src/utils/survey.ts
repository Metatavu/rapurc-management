import { OwnerInformation, Survey, Building } from "generated/client";
import { SurveyWithInfo } from "types";

/**
 * Utility class for survey
 */
export default class SurveyUtils {

  /**
   * Parse survey with information
   */
  public static parseToSurveyWithInfo(survey: Survey, building?: Building, ownerInformation?: OwnerInformation) {
    if (!survey.id) {
      return undefined;
    }

    const surveyWithInfo: SurveyWithInfo = {
      id: survey.id,
      status: survey.status,
      ownerId: ownerInformation?.id,
      buildingId: building?.buildingId,
      classificationCode: building?.buildingTypeId,
      ownerName: ownerInformation?.ownerName,
      city: building?.address?.city,
      streetAddress: building?.address?.streetAddress
    };

    return surveyWithInfo;
  }

}