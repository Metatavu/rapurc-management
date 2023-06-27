import { Box, Button, CircularProgress, List, TextField, Typography } from "@mui/material";
import Api from "api";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import GenericDialog from "components/generic/generic-dialog";
import SidePanelLayout from "components/layouts/side-panel-layout";
import StackLayout from "components/layouts/stack-layout";
import { selectKeycloak } from "features/auth-slice";
import { setUserGroups } from "features/group-slice";
import { JoinRequestStatus, UserGroup } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupRoutes from "./group-management-routes";
import NavigationItem from "components/layout-components/navigation-item";
import { useParams } from "react-router-dom";

/**
 * Group management component
 */
const GroupManagementScreen: FC = () => {
  const dispatch = useAppDispatch();
  const keycloak = useAppSelector(selectKeycloak);
  const errorContext = useContext(ErrorContext);
  const [ inviteDialogOpen, setInviteDialogOpen ] = useState(false);
  const [ inviteMemberEmail, setInviteMemberEmail ] = useState("");
  const [ usersGroups, setUsersGroups ] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const { groupId } = useParams();

  console.log("grou0p id from params is ", groupId);
  console.log("users groups", usersGroups);

  /**
   * Gets groups user is group admin of
   *
   * @returns list of groups user is admin of
   */
  const loadGroups = async () => {
    if (!keycloak?.token || !keycloak?.tokenParsed) {
      return;
    }

    setLoading(true);
    try {
      const foundGroups = await Api.getUserGroupsApi(keycloak.token).listUserGroups({
        adminEmail: keycloak.tokenParsed.email
      });
      dispatch(setUserGroups(foundGroups));
      setUsersGroups(foundGroups);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupDialogsScreen.listGroups);
    }
    setLoading(false);
  };

  /**
   * Effect that loads user keycloak groups
   */
  useEffect(() => {
    // TODO: Conditional here if the userGroups are not available
    loadGroups();
  }, []);

  // TODO: Data grid example
  // /**
  //  * Render survey data table for desktop
  //  */
  // const renderSurveyDataTable = () => {
  //   const columns: GridColDef[] = [
  //     {
  //       field: "status",
  //       headerName: strings.surveysScreen.dataGridColumns.status,
  //       width: 150,
  //       valueFormatter: ({ value }) => LocalizationUtils.getLocalizedSurveyStatus(value as SurveyStatus)
  //     },
  //     {
  //       field: "buildingId",
  //       headerName: strings.surveysScreen.dataGridColumns.buildingId,
  //       width: 200
  //     },
  //     {
  //       field: "classificationCode",
  //       headerName: strings.surveysScreen.dataGridColumns.classificationCode,
  //       flex: 1
  //     },
  //     {
  //       field: "ownerName",
  //       headerName: strings.surveysScreen.dataGridColumns.ownerName,
  //       flex: 1
  //     },
  //     {
  //       field: "propertyName",
  //       headerName: strings.surveysScreen.dataGridColumns.propertyName,
  //       flex: 1
  //     },
  //     {
  //       field: "city",
  //       headerName: strings.surveysScreen.dataGridColumns.city,
  //       width: 200
  //     },
  //     {
  //       field: "streetAddress",
  //       headerName: strings.surveysScreen.dataGridColumns.streetAddress,
  //       flex: 1
  //     }
  //   ];

  //   const filteredRows = surveysWithInfo
  //     .filter(surveyWithInfo => !addressFilter || surveyWithInfo.streetAddress?.includes(addressFilter))
  //     .filter(surveyWithInfo => filter === SurveyShow.ShowAll || (filter === SurveyShow.ShowMine && surveyWithInfo.creatorId === keycloak?.profile?.id));

  //   return (
  //     <Paper>
  //       <DataGrid
  //         checkboxSelection
  //         autoHeight
  //         loading={ loading }
  //         rows={ filteredRows }
  //         columns={ columns }
  //         pageSize={ 10 }
  //         disableSelectionOnClick
  //         onRowClick={ onSurveyTableRowClick }
  //         onSelectionModelChange={ selectedIds => setSelectedSurveyIds(selectedIds as string[]) }
  //       />
  //     </Paper>
  //   );
  // };

  // if (loading) {
  //   return (
  //     <Box
  //       style={{
  //         position: "absolute",
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         top: 0,
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: "rgba(0,158,158,0.85)",
  //         color: "#fff"
  //       }}
  //     >
  //       <Stack spacing={ 2 } alignItems="center">
  //         <Typography>Ladataan kartoituksia</Typography>
  //         <CircularProgress color="inherit"/>
  //       </Stack>
  //     </Box>
  //   );
  // }

  /**
   * Handle invite member email changes
   *
   * @param event event
   */
  const onInviteMemberEmailChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInviteMemberEmail(target.value);
  };

  /**
   * Creates a new group invite
   */
  const inviteMember = async () => {
    if (!keycloak?.token || !keycloak?.tokenParsed || !groupId) return;

    setLoading(true);
    try {
      await Api.getGroupJoinInvitesApi(keycloak.token).createGroupJoinInvite({
        groupId: groupId,
        groupJoinInvite: {
          email: keycloak.tokenParsed.email,
          groupId: groupId,
          status: JoinRequestStatus.Pending
        }
      });

      setLoading(false);
      setInviteDialogOpen(false);
    } catch (error) {
      errorContext.setError("Error while creating group invite");
    }
  };

  /**
   * TODO: strings
   * @returns
   */
  const renderSidePanelHeaders = () => (

    <List>
      <NavigationItem
        // icon={ <PersonOutlined/> }
        to="members"
        title="members"
      />
      <NavigationItem
        // icon={ <Apartment/> }
        to="pendingInvites"
        title="pendingInvites"
      />
      <NavigationItem
        // icon={ <NoteAdd/> }
        to="pendingRequests"
        title="pendingRequests"
      />
    </List>
  );

  /**
   * Renders the welcome dialog
   */
  const renderInviteDialog = () => (
    <GenericDialog
      error={ false }
      open={ inviteDialogOpen }
      onClose={ () => setInviteDialogOpen(false) }
      onCancel={ () => setInviteDialogOpen(false) }
      onConfirm={ inviteMember }
      title="Send invite"
      positiveButtonText="Send invite"
      cancelButtonText={ strings.groupDialogsScreen.cancel }
    >
      <Typography>
        <TextField
          fullWidth
          name="inviteMemberEmail"
          value={ inviteMemberEmail }
          placeholder="Anna sähköpostiosoite"
          onChange={ onInviteMemberEmailChange }
        />
      </Typography>
    </GenericDialog>
  );

  /**
   * TODO: commments and strings
   * @returns
   */
  const renderInviteButton = () => {
    return (
      <Button
        onClick={ () => setInviteDialogOpen(true) }
        startIcon={ <PersonAddIcon/> }
      >
        Invite member
      </Button>
    );
  };

  if (loading) {
    return (
      <StackLayout title="">
        <Box
          display="flex"
          flex={ 1 }
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress color="inherit" size={ 60 }/>
        </Box>
      </StackLayout>
    );
  }

  return (
    <>
      { renderInviteDialog() }
      <SidePanelLayout
        title="Group Management"
        sidePanelContent={ renderSidePanelHeaders() }
        back
        headerContent={ renderInviteButton() }
      >
        <GroupRoutes groupId={ groupId }/>
      </SidePanelLayout>
    </>
  );
};

export default GroupManagementScreen;