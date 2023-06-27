import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessTokenRefresh from "components/containers/access-token-refresh";
import SurveysScreen from "components/screens/surveys-screen";
import NewSurveyScreen from "./screens/new-survey-screen";
import AdminScreen from "./screens/admin-screen";
import SurveyScreen from "./screens/survey-screen";
import ListingScreen from "./screens/survey-listing-screen";
import ErrorHandler from "./error-handler/error-handler";
import VisibleWithRole from "./containers/visible-with-role";
import moment from "moment";
import "moment/locale/fi";
import { useAppSelector } from "app/hooks";
import { selectLanguage } from "features/locale-slice";
import GroupDialogScreen from "./screens/group-dialog-screen";
import GroupManagementScreen from "./screens/group-management-screen";

/**
 * Application component
 */
const App: React.FC = () => {
  const language = useAppSelector(selectLanguage);

  React.useEffect(() => {
    moment.locale(language);
  }, [language]);

  return (
    <ErrorHandler>
      <AccessTokenRefresh>
        <Router>
          <Routes>
            <Route
              path="/surveys"
              element={ <SurveysScreen/> }
            />
            <Route
              path="/new-survey"
              element={ <NewSurveyScreen/> }
            />
            <Route
              path="/surveys/:surveyId/*"
              element={ <SurveyScreen/> }
            />
            <Route
              path="/groups/:groupId*"
              element={ <GroupManagementScreen/> }
            />
            <Route
              path="/admin/*"
              element={
                <VisibleWithRole userRole="admin">
                  <AdminScreen/>
                </VisibleWithRole>
              }
            />
            <Route
              path="/listing/:surveyId/:materialId/*"
              element={
                <VisibleWithRole userRole="admin">
                  <ListingScreen/>
                </VisibleWithRole>
              }
            />
            <Route
              path="/"
              element={ <GroupDialogScreen/> }
            />
          </Routes>
        </Router>
      </AccessTokenRefresh>
    </ErrorHandler>
  );
};

export default App;