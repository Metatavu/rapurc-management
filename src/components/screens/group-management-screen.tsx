import { Box, Button, CircularProgress, List, TextField, Typography } from "@mui/material";
import Api from "api";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { ErrorContext } from "components/error-handler/error-handler";
import GenericDialog from "components/generic/generic-dialog";
import SidePanelLayout from "components/layouts/side-panel-layout";
import { selectKeycloak } from "features/auth-slice";
import { setUserGroups } from "features/group-slice";
import { GroupJoinInvite, GroupJoinRequest, JoinRequestStatus, User, UserGroup } from "generated/client";
import strings from "localization/strings";
import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import SendIcon from "@mui/icons-material/Send";
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
  const [ groupMembers, setGroupMembers ] = useState<User[]>([]);
  const [ pendingRequests, setPendingRequests ] = useState<GroupJoinRequest[]>([]);
  const [ pendingInvites, setPendingInvites ] = useState<GroupJoinInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const { groupId } = useParams();

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
      const foundGroups = await Api.getUserGroupsApi(keycloak.token).listUserGroups({});
      dispatch(setUserGroups(foundGroups));
      setUsersGroups(foundGroups);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupDialogsScreen.listGroups);
    }
    setLoading(false);
  };

  /**
   * Load user group members
   *
   * @returns list of user groups group members
   */
  const loadGroupMembers = async () => {
    if (!keycloak?.token || !groupId) {
      return;
    }

    setLoading(true);
    try {
      const allMembers = await Api.getUserGroupsApi(keycloak.token).listGroupMembers({
        groupId: groupId
      });

      setGroupMembers(allMembers);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.inviteMember);
    }
    setLoading(false);
  };

  /**
   * Load pending user group requests
   *
   * @returns a list of user group pending requests
   */
  const loadPendingRequests = async () => {
    if (!keycloak?.token || !groupId) {
      return;
    }

    setLoading(true);
    try {
      const foundPendingRequests = await Api.getGroupJoinRequestsApi(keycloak.token).listGroupJoinRequests({
        groupId: groupId,
        status: JoinRequestStatus.Pending
      });

      setPendingRequests(foundPendingRequests);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.pendingRequests);
    }
    setLoading(false);
  };

  /**
   * Load pending user group invites
   *
   * @returns a list of user group pending invites
   */
  const loadPendingInvites = async () => {
    if (!keycloak?.token || !groupId) {
      return;
    }

    setLoading(true);
    try {
      const allInvites = await Api.getGroupJoinInvitesApi(keycloak.token).listGroupJoinInvites({
        groupId: groupId
      });

      setPendingInvites(allInvites.filter(invite => invite.status === JoinRequestStatus.Pending));
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.pendingInvites);
    }
    setLoading(false);
  };

  /**
   * Load all data required for screen
   */
  const loadData = async () => {
    await loadGroups();
    await loadGroupMembers();
    await loadPendingRequests();
    await loadPendingInvites();
  };

  /**
   * Effect that loads page data
   */
  useEffect(() => {
    loadData();
  }, [groupId]);

  /**
   * Handle invite member email changes
   *
   * @param event event
   */
  const onInviteMemberEmailChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setInviteMemberEmail(target.value);
  };

  /**
   * Get group name from groupId
   */
  const getGroupName = () => {
    if (!usersGroups || !groupId) return "";

    const currentGroup = usersGroups.find(group => group.id === groupId);

    if (!currentGroup) return "";

    return ` - ${currentGroup.name}`;
  };

  /**
   * Creates a new group invite
   */
  const inviteMember = async () => {
    if (!keycloak?.token || !groupId || !inviteMemberEmail) return;

    setLoading(true);
    try {
      const newInvite = await Api.getGroupJoinInvitesApi(keycloak.token).createGroupJoinInvite({
        groupId: groupId,
        groupJoinInvite: {
          email: inviteMemberEmail,
          groupId: groupId,
          status: JoinRequestStatus.Pending
        }
      });

      setPendingInvites([...pendingInvites, newInvite]);
      setInviteDialogOpen(false);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupManagementScreen.inviteMember);
    }

    setLoading(false);
  };

  /**
   * Render side panel headers
   */
  const renderSidePanelHeaders = () => (

    <List>
      <NavigationItem
        icon={ <GroupIcon/> }
        to="members"
        title={ strings.groupManagementScreen.groupMembers }
      />
      <NavigationItem
        icon={ <SendIcon/> }
        to="pendingInvites"
        title={ strings.formatString(strings.groupManagementScreen.pendingInvites, String(pendingInvites.length) || "") as string }
      />
      <NavigationItem
        icon={ <PersonAddIcon/> }
        to="pendingRequests"
        title={ strings.formatString(strings.groupManagementScreen.pendingRequests, String(pendingRequests.length) || "") as string }
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
      title={ strings.groupManagementScreen.sendInvite }
      positiveButtonText={ strings.groupManagementScreen.sendInvite }
      cancelButtonText={ strings.groupDialogsScreen.cancel }
    >
      <Typography>
        <TextField
          fullWidth
          name="inviteMemberEmail"
          value={ inviteMemberEmail }
          placeholder={ strings.groupManagementScreen.invitePlaceholder }
          onChange={ onInviteMemberEmailChange }
        />
      </Typography>
    </GenericDialog>
  );

  /**
   * Renders invite button
   */
  const renderInviteButton = () => {
    return (
      <Button
        onClick={ () => setInviteDialogOpen(true) }
        startIcon={ <PersonAddIcon/> }
      >
        { strings.groupManagementScreen.inviteMember }
      </Button>
    );
  };

  /**
   * Renders loading spinner
   */
  const renderLoadingSpinner = () => {
    return (
      <Box
        display="flex"
        flex={ 1 }
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress color="inherit" size={ 60 }/>
      </Box>
    );
  };

  return (
    <>
      { renderInviteDialog() }
      <SidePanelLayout
        // TODO: Missing subtitle
        title={ strings.formatString(strings.groupManagementScreen.groupManagement, getGroupName()) as string }
        sidePanelContent={ renderSidePanelHeaders() }
        back
        headerContent={ renderInviteButton() }
      >
        {
          loading ?
            renderLoadingSpinner() :
            <GroupRoutes
              groupId={ groupId }
              groupMembers={ groupMembers }
              pendingRequests={ pendingRequests }
              pendingInvites={ pendingInvites }
              setPendingRequests={ setPendingRequests }
              setGroupMembers={ setGroupMembers }
            />
        }
      </SidePanelLayout>
    </>
  );
};

export default GroupManagementScreen;