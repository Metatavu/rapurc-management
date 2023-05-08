import { Apartment, Attachment, ChangeCircle, Delete, Engineering, NoteAdd, PersonOutlined, Summarize, WarningAmber } from "@mui/icons-material";
import { Divider, List, MenuItem, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import NavigationItem from "components/layout-components/navigation-item";
import SidePanelLayout from "components/layouts/side-panel-layout";
import { fetchSelectedSurvey, updateSurvey } from "features/surveys-slice";
import { Survey, SurveyStatus } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEventHandler, FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LocalizationUtils from "utils/localization-utils";
import SurveyRoutes from "./survey-routes";
import moment from "moment";

/**
 * Survey screen component
 */
const SurveyScreen: FC = () => {
  const dispatch = useAppDispatch();
  const errorContext = useContext(ErrorContext);
  const { surveyId } = useParams<"surveyId">();
  
  const [ survey, setSurvey ] = useState<Survey | undefined>();

  /**
   * Fetches survey based on URL survey ID
   */
  const fetchSurvey = async () => {
    if (!surveyId) {
      return;
    }

    try {
      const selectedSurvey = await dispatch(fetchSelectedSurvey(surveyId)).unwrap();
      setSurvey(selectedSurvey);
    } catch (error) {
      errorContext.setError(strings.errorHandling.surveys.find, error);
    }
  };

  /**
   * Effect for fetching surveys. Triggered when survey ID is changed
   */
  useEffect(() => { fetchSurvey(); }, [ surveyId ]);

  if (!survey) {
    return null;
  }

  /**
   * Event handler for survey status change
   */
  const onStatusChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = ({ target }) => {
    const { value } = target;

    dispatch(updateSurvey({
      ...survey,
      status: value as SurveyStatus,
      markedAsDone: value === SurveyStatus.Done ? new Date() : undefined
    }))
      .unwrap()
      .then(_survey => setSurvey(_survey))
      .catch(error => errorContext.setError(strings.errorHandling.surveys.find, error));
  };

  /**
   * Side navigation content
   *
   */
  const renderSideNavigation = () => (
    <List>
      <NavigationItem
        icon={ <PersonOutlined/> }
        to="owner"
        title={ strings.surveyScreen.navigation.owner }
      />
      <NavigationItem
        icon={ <Apartment/> }
        to="building"
        title={ strings.surveyScreen.navigation.building }
      />
      <NavigationItem
        icon={ <NoteAdd/> }
        to="otherStructures"
        title={ strings.surveyScreen.navigation.otherStructures }
      />
      <NavigationItem
        icon={ <Engineering/> }
        to="info"
        title={ strings.surveyScreen.navigation.info }
      />
      <NavigationItem
        icon={ <ChangeCircle/> }
        to="reusables"
        title={ strings.surveyScreen.navigation.reusables }
      />
      <NavigationItem
        icon={ <Delete/> }
        to="waste"
        title={ strings.surveyScreen.navigation.waste }
      />
      <NavigationItem
        icon={ <WarningAmber/> }
        to="hazardous"
        title={ strings.surveyScreen.navigation.hazardous }
      />
      <Divider/>
      <NavigationItem
        icon={ <Attachment/> }
        to="attachments"
        title={ strings.surveyScreen.navigation.attachments }
      />
      <NavigationItem
        icon={ <Summarize/> }
        to="summary"
        title={ strings.surveyScreen.navigation.summary }
      />
    </List>
  );

  /**
   * Renders survey status select
   */
  const renderStatusSelect = () => {
    const { status } = survey;

    const options = Object.values(SurveyStatus).map(surveyStatus =>
      <MenuItem key={ surveyStatus } value={ surveyStatus }>
        { LocalizationUtils.getLocalizedSurveyStatus(surveyStatus) }
      </MenuItem>
    );

    return (
      <TextField
        color="secondary"
        variant="standard"
        select
        value={ status }
        label={ strings.surveyScreen.status }
        onChange={ onStatusChange }
      >
        { options }
      </TextField>
    );
  };

  /**
   * Renders surveys last modified date
   */
  const renderLastModifiedDate = () => {
    const { modifiedAt } = survey.metadata;
    
    return (
      <Typography variant="h5" fontSize={ 18 }>
        { strings.formatString(`${strings.surveyScreen.lastModified}: ${(moment(modifiedAt).format("D.M.YYYY h:mm"))}`) }
      </Typography>
    );
  };

  /**
   * Component render
   */
  return (
    <SidePanelLayout
      title={ strings.surveyScreen.title }
      sidePanelContent={ renderSideNavigation() }
      renderLastModifiedDate={ renderLastModifiedDate() }
      headerControls={ renderStatusSelect() }
      back
    >
      <SurveyRoutes surveyId={ surveyId }/>
    </SidePanelLayout>
  );
};

export default SurveyScreen;