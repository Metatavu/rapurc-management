import { Print } from "@mui/icons-material";
import { Box, CircularProgress, Divider, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import Api from "api";
import { useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import { selectKeycloak } from "features/auth-slice";
import { selectSelectedSurvey } from "features/surveys-slice";
import { Building, BuildingType, HazardousMaterial, HazardousWaste, OwnerInformation, Reusable, ReusableMaterial, Surveyor, Usage, Waste, WasteCategory, WasteMaterial } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import * as React from "react";
import { SurveyButton } from "styled/screens/surveys-screen";
import theme from "theme";
import LocalizationUtils from "utils/localization-utils";

interface SurveySummary {
  building?: Building;
  buildingTypes: BuildingType[];
  ownerInformation?: OwnerInformation;
  reusables: Reusable[];
  reusableMaterials: ReusableMaterial[];
  wastes: Waste[];
  wasteCategories: WasteCategory[];
  wasteMaterials: WasteMaterial[];
  hazardousWastes: HazardousWaste[];
  hazardousMaterials: HazardousMaterial[];
  usages: Usage[];
  surveyors: Surveyor[];
}

const initialSurveySummary: SurveySummary = {
  buildingTypes: [],
  reusables: [],
  reusableMaterials: [],
  wastes: [],
  wasteCategories: [],
  wasteMaterials: [],
  hazardousWastes: [],
  hazardousMaterials: [],
  usages: [],
  surveyors: []
};

/**
 * Component for summary view
 */
const SummaryView: React.FC = () => {
  const keycloak = useAppSelector(selectKeycloak);
  const errorContext = React.useContext(ErrorContext);
  const selectedSurvey = useAppSelector(selectSelectedSurvey);
  const [ loading, setLoading ] = React.useState(false);
  const [ surveySummary, setSurveySummary ] = React.useState<SurveySummary>(initialSurveySummary);

  /**
   * Fetches owner information array
   */
  const fetchOwnerInformation = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      const fetchedOwnerInformationArray = await Api.getOwnersApi(keycloak.token).listOwnerInformation({
        surveyId: selectedSurvey.id
      });

      if (fetchedOwnerInformationArray.length !== 1) {
        return;
      }

      return fetchedOwnerInformationArray[0];
    } catch (error) {
      errorContext.setError(strings.errorHandling.owners.create, error);
    }
  };

  /**
   * Fetches building types
   */
  const fetchBuildingTypes = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      return await Api.getBuildingTypesApi(keycloak.token).listBuildingTypes();
    } catch (error) {
      errorContext.setError(strings.errorHandling.buildingTypes.list, error);
    }
  };

  /**
   * Fetches building
   */
  const fetchBuilding = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      const fetchedBuildings = await Api.getBuildingsApi(keycloak.token).listBuildings({
        surveyId: selectedSurvey.id
      });

      if (fetchedBuildings.length !== 1) {
        return;
      }

      return fetchedBuildings[0];
    } catch (error) {
      errorContext.setError(strings.errorHandling.buildings.list, error);
    }
  };

  /**
   * Fetches reusables
   */
  const fetchReusables = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      return await Api.getSurveyReusablesApi(keycloak.token).listSurveyReusables({ surveyId: selectedSurvey.id });
    } catch (error) {
      errorContext.setError(strings.errorHandling.reusables.list, error);
    }
  };

  /**
   * Fetches list of reusable materials and building parts
   */
  const fetchReusableMaterials = async () => {
    if (!keycloak?.token) {
      return;
    }

    try {
      return await Api.getReusableMaterialApi(keycloak.token).listReusableMaterials();
    } catch (error) {
      errorContext.setError(strings.errorHandling.materials.list, error);
    }
  };

  /**
   * Fetches waste array
   */
  const fetchWastes = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      return await Api.getWastesApi(keycloak.token).listSurveyWastes({ surveyId: selectedSurvey.id });
    } catch (error) {
      errorContext.setError(strings.errorHandling.waste.list, error);
    }
  };

  /**
   * Fetches list of waste categories
   */
  const fetchWasteCategories = async () => {
    if (!keycloak?.token) {
      return;
    }

    try {
      return await Api.getWasteCategoryApi(keycloak.token).listWasteCategories();
    } catch (error) {
      errorContext.setError(strings.errorHandling.wasteMaterials.list, error);
    }
  };

  /**
   * Fetches waste material array
   */
  const fetchWastesMaterials = async () => {
    if (!keycloak?.token) {
      return;
    }

    try {
      return await Api.getWasteMaterialApi(keycloak.token).listWasteMaterials();
    } catch (error) {
      errorContext.setError(strings.errorHandling.wasteMaterial.list, error);
    }
  };

  /**
   * Fetch hazardous waste array
   */
  const fetchHazardousWaste = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      return await Api.getHazardousWasteApi(keycloak.token).listSurveyHazardousWastes({ surveyId: selectedSurvey.id });
    } catch (error) {
      errorContext.setError(strings.errorHandling.hazardousWastes.list, error);
    }
  };

  /**
   * Fetches hazardous material array
   */
  const fetchHazardousMaterial = async () => {
    if (!keycloak?.token) {
      return;
    }

    try {
      return await Api.getHazardousMaterialApi(keycloak.token).listHazardousMaterials();
    } catch (error) {
      errorContext.setError(strings.errorHandling.hazardousMaterials.list, error);
    }
  };

  /**
   * Fetches usage array
   */
  const fetchUsages = async () => {
    if (!keycloak?.token) {
      return;
    }

    try {
      return await Api.getUsageApi(keycloak.token).listUsages();
    } catch (error) {
      errorContext.setError(strings.errorHandling.postProcess.list, error);
    }
  };

  // TODO hazardous materials wastes

  /**
   * Fetch surveyor array
   */
  const fetchSurveyors = async () => {
    if (!keycloak?.token || !selectedSurvey?.id) {
      return;
    }

    try {
      return await Api.getSurveyorsApi(keycloak.token).listSurveyors({ surveyId: selectedSurvey.id });
    } catch (error) {
      errorContext.setError(strings.errorHandling.surveyors.list, error);
    }
  };

  /**
   * Fetches summary data
   */
  const fetchData = async () => {
    setLoading(true);
    // @ts-ignore
    const resolvedResult = await Promise.all([
      fetchBuilding(),
      fetchBuildingTypes(),
      fetchOwnerInformation(),
      fetchReusables(),
      fetchReusableMaterials(),
      fetchWasteCategories(),
      fetchWastes(),
      fetchWastesMaterials(),
      fetchUsages(),
      fetchSurveyors(),
      fetchHazardousWaste(),
      fetchHazardousMaterial()
    ]);

    const fetchedSurveySummary: SurveySummary = {
      // @ts-ignore
      building: resolvedResult[0],
      // @ts-ignore
      buildingTypes: resolvedResult[1] || [],
      // @ts-ignore
      ownerInformation: resolvedResult[2],
      // @ts-ignore
      reusables: resolvedResult[3] || [],
      // @ts-ignore
      reusableMaterials: resolvedResult[4] || [],
      // @ts-ignore
      wasteCategories: resolvedResult[5] || [],
      // @ts-ignore
      wastes: resolvedResult[6] || [],
      // @ts-ignore
      wasteMaterials: resolvedResult[7] || [],
      // @ts-ignore
      usages: resolvedResult[8] || [],
      // @ts-ignore
      surveyors: resolvedResult[9] || [],
      // @ts-ignore
      hazardousWastes: resolvedResult[10] || [],
      // @ts-ignore
      hazardousMaterials: resolvedResult[11] || []
    };

    setSurveySummary(fetchedSurveySummary);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  /**
   * Check if viewport is mobile size
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    buildingTypes,
    hazardousMaterials,
    hazardousWastes,
    reusableMaterials,
    reusables,
    surveyors,
    usages,
    wasteCategories,
    wasteMaterials,
    wastes,
    building,
    ownerInformation
  } = surveySummary;

  /**
   * Renders data title
   * 
   * @param title title
   */
  const renderDataTitle = (title: string) => (
    <Typography variant="subtitle2">
      { title }
    </Typography>
  );

  /**
   * Render data value
   * 
   * @param value value
   */
  const renderDataValue = (value?: string | number) => value?.toString() && (
    <Typography variant="body2">
      { value.toString() }
    </Typography>
  );

  /**
   * Renders data cell
   * 
   * @param title title
   * @param value value
   */
  const renderDataCell = (title: string, value?: string | number) => (
    <Stack>
      { renderDataTitle(title) }
      { renderDataValue(value || "-") }
    </Stack>
  );

  /**
   * Renders data cell with inline label
   * 
   * @param title title
   * @param value value
   */
  const renderMediaDataCell = (title: string, value?: string | number) => (
    <Stack flex={ 1 }>
      { renderDataTitle(`${title}:`) }
      { renderDataValue(value || "-") }
    </Stack>
  );

  /**
   * Renders building info section
   */
  const renderBuildingInfoSection = () => {
    if (!building) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.building.title }
        </Typography>
        <Paper>
          <Stack
            direction={ isMobile ? "column" : "row" }
            spacing={ 2 }
            p={ 2 }
          >
            <Stack width="100%" spacing={ 2 }>
              { renderDataCell(strings.survey.building.propertyID, building.propertyId) }
              { renderDataCell(strings.survey.building.buildingID, building.buildingId) }
              { renderDataCell(strings.survey.building.buildingClass, buildingTypes?.find(buildingType => buildingType.id === building.buildingTypeId)?.name) }
              { renderDataCell(strings.survey.building.year, building.constructionYear) }
              { renderDataCell(strings.survey.building.area, building.space) }
              { renderDataCell(strings.survey.building.volume, building.volume) }
            </Stack>
            <Stack width="100%" spacing={ 2 }>
              { renderDataCell(strings.survey.building.floors, building.floors) }
              { renderDataCell(strings.survey.building.basementFloors, building.basements) }
              { renderDataCell(strings.survey.building.foundationMaterial, building.foundation) }
              { renderDataCell(strings.survey.building.supportingStructure, building.supportingStructure) }
              { renderDataCell(strings.survey.building.façadeMaterial, building.facadeMaterial) }
              { renderDataCell(strings.survey.building.roofStructure, building.roofType) }
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    );
  };

  /**
   * Renders owner info section
   */
  const renderOwnerInfoSection = () => {
    if (!ownerInformation) {
      return null;
    }

    return (
      <Stack direction={ isMobile ? "column" : "row" } spacing={ 2 }>
        <Stack spacing={ 2 } width="100%">
          <Typography variant="h3">
            { strings.survey.owner.title }
          </Typography>
          <Paper sx={{ p: 2 }}>
            { renderDataValue(ownerInformation.ownerName) }
          </Paper>
        </Stack>
        <Stack spacing={ 2 } width="100%">
          <Typography variant="h3">
            { strings.survey.owner.contactPerson }
          </Typography>
          <Paper>
            <Stack spacing={ 2 } p={ 2 }>
              { renderDataValue(`${ownerInformation.contactPerson?.firstName || ""} ${ownerInformation.contactPerson?.lastName || ""}`) }
              { renderDataValue(ownerInformation.contactPerson?.profession) }
              { renderDataValue(ownerInformation.contactPerson?.phone) }
              { renderDataValue(ownerInformation.contactPerson?.email) }
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    );
  };

  /**
   * Renders other structures section
   */
  const renderOtherStructuresSection = () => {
    if (!building?.otherStructures) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.otherStructures.title }
        </Typography>
        <Stack spacing={ 2 }>
          { building?.otherStructures.map(otherStructure => (
            <Paper elevation={ 1 } key={ otherStructure.name }>
              <Stack spacing={ 2 } p={ 2 }>
                <Typography variant="h4">
                  { otherStructure.name }
                </Typography>
                { renderMediaDataCell(strings.survey.otherStructures.description, otherStructure.description) }
              </Stack>
            </Paper>
          ))
          }
        </Stack>
      </Stack>
    );
  };

  /**
   * Renders owner info section
   */
  const renderSurveyInfoSection = () => {
    if (!selectedSurvey) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.info.title }
        </Typography>
        <Paper>
          <Stack
            direction={ isMobile ? "column" : "row" }
            spacing={ isMobile ? 2 : 6 }
            padding={ 2 }
          >
            { renderDataCell(strings.survey.info.demolitionScope, LocalizationUtils.getLocalizedDemolitionScope(selectedSurvey.type)) }
            { !isMobile &&
              <Divider
                variant="inset"
                orientation="vertical"
                flexItem
              />
            }
            { renderDataCell(strings.survey.info.startDate, moment(selectedSurvey.startDate).format("MMMM YYYY")) }
            { !isMobile &&
              <Divider
                variant="inset"
                orientation="vertical"
                flexItem
              />
            }
            { renderDataCell(strings.survey.info.endDate, moment(selectedSurvey.endDate).format("MMMM YYYY")) }
          </Stack>
        </Paper>
      </Stack>
    );
  };

  /**
   * Renders surveyor section
   */
  const renderSurveyorSection = () => {
    if (!surveyors.length) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.info.surveyors }
        </Typography>
        <Paper>
          <Stack direction={ isMobile ? "column" : "row" }>
            { surveyors.map(surveyor =>
              (
                <Stack
                  key={ surveyor.id }
                  flex={ 1 }
                  p={ 2 }
                  direction="row"
                  justifyContent="space-between"
                >
                  { renderDataCell(surveyor.role || "", `${surveyor.firstName || ""} ${surveyor.lastName || ""}`) }
                  { !isMobile &&
                    <Divider
                      variant="inset"
                      orientation="vertical"
                      flexItem
                    />
                  }
                </Stack>
              )) }
          </Stack>
        </Paper>
      </Stack>
    );
  };

  /**
   * Renders surveyor section
   */
  const renderReusableMaterialsSection = () => {
    if (!reusables.length) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.reusables.title }
        </Typography>
        <Stack spacing={ 2 }>
          { reusables.map(reusable => {
            const materialName = reusableMaterials.find(reusableMaterial => reusableMaterial.id === reusable.reusableMaterialId)?.name || "";
            const materialUsability = LocalizationUtils.getLocalizedUsability(reusable.usability);
            const materialAmount = `${reusable.amount} ${reusable.unit ? LocalizationUtils.getLocalizedUnits(reusable.unit) : ""}`;
            const materialAmountAsWaste = `${reusable.amountAsWaste} ${strings.units.tons}`;

            return (
              <Paper elevation={ 1 } key={ reusable.id }>
                <Stack spacing={ 2 } p={ 2 }>
                  <Typography variant="h4">
                    { reusable.componentName }
                  </Typography>
                  <Stack
                    spacing={ isMobile ? 2 : 4}
                    justifyContent="space-between"
                    direction={ isMobile ? "column" : "row" }
                  >
                    { renderMediaDataCell(strings.survey.reusables.dataGridColumns.buildingPart, materialName) }
                    <Divider
                      variant="inset"
                      orientation="vertical"
                      flexItem
                    />
                    { renderMediaDataCell(strings.survey.reusables.dataGridColumns.usability, materialUsability)}
                    <Divider
                      variant="inset"
                      orientation="vertical"
                      flexItem
                    />
                    { renderMediaDataCell(strings.survey.reusables.dataGridColumns.amount, materialAmount)}
                    <Divider
                      variant="inset"
                      orientation="vertical"
                      flexItem
                    />
                    { reusable.amountAsWaste && renderMediaDataCell(strings.survey.reusables.dataGridColumns.wasteAmount, materialAmountAsWaste) }
                  </Stack>
                  { renderMediaDataCell(strings.survey.reusables.dataGridColumns.description, reusable.description) }
                </Stack>
              </Paper>
            );
          })
          }
        </Stack>
      </Stack>
    );
  };

  /**
   * Renders waste material section
   */
  const renderWasteMaterialsSection = () => {
    if (!wastes.length) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.wasteMaterial.title }
        </Typography>
        <Stack spacing={ 2 }>
          { wastes.map(waste => {
            const wasteMaterial = wasteMaterials.find(material => material.id === waste.wasteMaterialId);
            const wasteCategory = wasteCategories.find(category => category.id === wasteMaterial?.wasteCategoryId);
            const fullEwcCode = `${wasteCategory?.ewcCode || ""}${wasteMaterial?.ewcSpecificationCode}`;
            const wasteUsage = usages.find(usage => usage.id === waste.usageId)?.name;
            const wasteAmount = `${waste?.amount || ""} ${strings.units.tons}`;

            return (
              <Paper elevation={ 1 } key={ waste.id }>
                <Stack spacing={ 2 } p={ 2 }>
                  <Stack direction="row">
                    <Typography variant="h4">
                      { wasteMaterial?.name }
                    </Typography>
                  </Stack>
                  <Stack
                    spacing={ isMobile ? 2 : 4}
                    justifyContent="space-between"
                    direction={ isMobile ? "column" : "row" }
                  >
                    { renderMediaDataCell(strings.survey.wasteMaterial.dataGridColumns.wasteCode, fullEwcCode) }
                    <Divider
                      variant="inset"
                      orientation="vertical"
                      flexItem
                    />
                    { renderMediaDataCell(strings.survey.wasteMaterial.dataGridColumns.usage, wasteUsage) }
                    <Divider
                      variant="inset"
                      orientation="vertical"
                      flexItem
                    />
                    { renderMediaDataCell(strings.survey.reusables.dataGridColumns.amount, wasteAmount) }
                  </Stack>
                  { renderMediaDataCell(strings.survey.reusables.dataGridColumns.description, waste.description) }
                </Stack>
              </Paper>
            );
          })
          }
        </Stack>
      </Stack>
    );
  };

  /**
   * Renders hazardous material section
   */
  const renderHazardousMaterialsSection = () => {
    if (!hazardousWastes.length) {
      return null;
    }

    return (
      <Stack spacing={ 2 }>
        <Typography variant="h3">
          { strings.survey.hazardousMaterial.title }
        </Typography>
        <Stack spacing={ 2 }>
          { hazardousWastes.map(hazardousWaste => {
            const wasteMaterial = wasteMaterials.find(material => material.id === hazardousWaste.hazardousMaterialId);
            const wasteCategory = wasteCategories.find(category => category.id === wasteMaterial?.wasteCategoryId);
            const fullEwcCode = `${wasteCategory?.ewcCode || ""}${wasteMaterial?.ewcSpecificationCode}`;

            return (
              <Paper key={ hazardousWaste.id }>
                <Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h4">
                      { hazardousMaterials.find(hazardousMaterial => hazardousMaterial.id === hazardousWaste.hazardousMaterialId)?.name }
                    </Typography>
                    <Typography variant="h4">
                      { fullEwcCode }
                    </Typography>
                  </Stack>
                  { renderMediaDataCell(strings.survey.hazardousMaterial.dataGridColumns.amount, hazardousWaste.amount) }
                  { renderMediaDataCell(strings.survey.reusables.dataGridColumns.description, hazardousWaste.description) }
                </Stack>
              </Paper>
            );
          })
          }
        </Stack>
      </Stack>
    );
  };

  /**
   * Renders list of materials
   */
  if (loading) {
    return (
      <Box
        display="flex"
        flex={ 1 }
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="primary" size={ 60 }/>
      </Box>
    );
  }

  return (
    <>
      <Stack
        spacing={ 2 }
        direction="row"
        justifyContent="space-between"
        marginBottom={ 2 }
      >
        <Typography variant="h2">
          { strings.survey.summary.title }
        </Typography>
        {/* TODO print button */}
        <SurveyButton
          variant="contained"
          color="secondary"
          startIcon={ <Print/> }
          onClick={ () => {} }
        >
          { strings.survey.summary.print }
        </SurveyButton>
      </Stack>
      <Stack spacing={ 4 }>
        { renderBuildingInfoSection() }
        { renderOtherStructuresSection() }
        { renderOwnerInfoSection() }
        { renderSurveyInfoSection() }
        { renderSurveyorSection() }
        { renderReusableMaterialsSection() }
        { renderWasteMaterialsSection() }
        { renderHazardousMaterialsSection() }
      </Stack>
    </>
  );
};

export default SummaryView;