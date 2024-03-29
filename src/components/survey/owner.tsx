import { Stack, TextField, Typography, useMediaQuery, Button } from "@mui/material";
import Api from "api";
import { useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import WithDebounce from "components/generic/with-debounce";
import { selectKeycloak } from "features/auth-slice";
import { Building, BuildingDemolitionContactUpdateTemplate, EmailType, OwnerInformation } from "generated/client";
import strings from "localization/strings";
import * as React from "react";
import theme from "theme";

/**
 * Component properties
 */
interface Props {
  surveyId: string;
}

/**
 * Component for owner information
 */
const Owner: React.FC<Props> = ({ surveyId }) => {
  const keycloak = useAppSelector(selectKeycloak);
  const errorContext = React.useContext(ErrorContext);
  const [ building, setBuilding ] = React.useState<Building>();
  const [ ownerInformation, setOwnerInformation ] = React.useState<OwnerInformation>();

  /**
   * Fetch building array
   */
  const fetchBuilding = async () => {
    if (!keycloak?.token || !surveyId) {
      return;
    }

    try {
      const fetchedBuildings = await Api.getBuildingsApi(keycloak.token).listBuildings({
        surveyId: surveyId
      });

      if (fetchedBuildings.length !== 1) {
        return;
      }

      setBuilding(fetchedBuildings[0]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.buildings.list, error);
    }
  };

  /**
   * Fetch owner information array
   */
  const fetchOwnerInformation = async () => {
    if (!keycloak?.token || !surveyId) {
      return;
    }

    try {
      const fetchedOwnerInformationArray = await Api.getOwnersApi(keycloak.token).listOwnerInformation({
        surveyId: surveyId
      });

      if (fetchedOwnerInformationArray.length !== 1) {
        return;
      }

      setOwnerInformation(fetchedOwnerInformationArray[0]);
    } catch (error) {
      errorContext.setError(strings.errorHandling.owners.create, error);
    }
  };

  React.useEffect(() => {
    fetchOwnerInformation();
    fetchBuilding();
  }, [surveyId]);

  /**
   * Updates owner information
   */
  const updateOwnerInformation = async (updatedOwnerInformation: OwnerInformation) => {
    if (!keycloak?.token || !ownerInformation?.id) {
      return;
    }

    try {
      Api.getOwnersApi(keycloak.token).updateOwnerInformation({
        surveyId: surveyId,
        ownerId: ownerInformation.id,
        ownerInformation: updatedOwnerInformation
      });
    } catch (error) {
      errorContext.setError(strings.errorHandling.owners.update, error);
    }
  };

  /**
   * Sends email to contact person
   */
  const handleSendLinkToEmail = () => {
    if (!keycloak?.token || !surveyId || !ownerInformation) {
      return;
    }

    const { contactPerson } = ownerInformation;
    if (!contactPerson?.email) {
      return;
    }
    try {
      const data: BuildingDemolitionContactUpdateTemplate = {
        buildingId: building?.id
      };
      Api.getEmailsApi(keycloak.token).sendSurveyEmail({
        surveyId: surveyId,
        emailTemplate: {
          emailAddress: contactPerson.email,
          emailType: EmailType.BuildingDemolitionContactUpdate,
          emailData: data
        }
      });
    } catch (error) {
      errorContext.setError(strings.errorHandling.owners.sendEmail, error);
    }
  };

  /**
   * Event Handler set survey prop
   */
  const onOwnerInfoPropChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = ({ target }) => {
    const { value, name } = target;

    if (!keycloak?.token || !ownerInformation?.id) {
      return;
    }

    const updatedOwnerInformation: OwnerInformation = { ...ownerInformation, [name]: value };
    setOwnerInformation(updatedOwnerInformation);
    updateOwnerInformation(updatedOwnerInformation);
  };

  /**
   * Event Handler set survey contact person prop
   */
  const onOwnerInfoContactPersonPropChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = ({ target }) => {
    const { value, name } = target;

    if (!keycloak?.token || !ownerInformation?.id) {
      return;
    }

    const updatedOwnerInformation: OwnerInformation = {
      ...ownerInformation,
      contactPerson: {
        ...ownerInformation.contactPerson,
        [name]: value
      }
    };
    setOwnerInformation(updatedOwnerInformation);
    updateOwnerInformation(updatedOwnerInformation);
  };

  /**
   * Renders textfield with debounce
   *
   * @param name name
   * @param label label
   * @param value value
   * @param onChange onChange
   */
  const renderWithDebounceTextField = (
    name: string,
    label: string,
    value:string,
    onChange: React.ChangeEventHandler<HTMLInputElement>
  ) => (
    <WithDebounce
      name={ name }
      value={ value }
      label={ label }
      onChange={ onChange }
      component={ props =>
        <TextField { ...props }/>
      }
    />
  );

  /**
   * Check if viewport is mobile size
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  if (!ownerInformation) {
    return null;
  }

  const {
    ownerName,
    contactPerson
  } = ownerInformation;

  return (
    <Stack direction={ isMobile ? "column" : "row" } spacing={ 2 }>
      <Stack spacing={ 2 } sx={{ flex: 1 }}>
        <Typography variant="h2">
          { strings.survey.owner.title }
        </Typography>
        {
          renderWithDebounceTextField(
            "ownerName",
            strings.survey.owner.name,
            ownerName || "",
            onOwnerInfoPropChange
          )
        }
        <TextField disabled label={ strings.survey.owner.tradeName }/>
      </Stack>
      <Stack spacing={ 2 } sx={{ flex: 1 }}>
        <Typography variant="h3" sx={{ marginBottom: 0.5 }}>
          { strings.survey.owner.contactPerson }
        </Typography>
        {
          renderWithDebounceTextField(
            "firstName",
            strings.survey.owner.firstName,
            contactPerson?.firstName || "",
            onOwnerInfoContactPersonPropChange
          )
        }
        {
          renderWithDebounceTextField(
            "lastName",
            strings.survey.owner.surname,
            contactPerson?.lastName || "",
            onOwnerInfoContactPersonPropChange
          )
        }
        {
          renderWithDebounceTextField(
            "profession",
            strings.survey.owner.occupation,
            contactPerson?.profession || "",
            onOwnerInfoContactPersonPropChange
          )
        }
        {
          renderWithDebounceTextField(
            "phone",
            strings.survey.owner.phone,
            contactPerson?.phone || "",
            onOwnerInfoContactPersonPropChange
          )
        }
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            display: "flex", justifyContent: "space-between", gap: 1
          }}
        >
          {
            renderWithDebounceTextField(
              "email",
              strings.survey.owner.email,
              ownerInformation?.contactPerson?.email || "",
              onOwnerInfoContactPersonPropChange
            )
          }
          {/* added a non-functional button, feature added later */}
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "200px", height: "50px" }}
            onClick={ handleSendLinkToEmail }
          >
            {strings.survey.owner.sendLink}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Owner;