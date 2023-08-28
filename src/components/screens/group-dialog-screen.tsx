import { Box, Checkbox, CircularProgress, FormControlLabel, List, ListItem, TextField, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import GenericDialog from "components/generic/generic-dialog";
import StackLayout from "components/layouts/stack-layout";
import { selectKeycloak } from "features/auth-slice";
import strings from "localization/strings";
import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import Api from "api";
import { GroupJoinInvite, JoinRequestStatus, UserGroup } from "generated/client";
import { CheckboxData, GroupDialogStatus } from "types";
import { ErrorContext } from "components/error-handler/error-handler";
import { useNavigate } from "react-router-dom";

/**
 * Group dialog screen component
 */
const GroupDialogScreen: FC = () => {
  const keycloak = useAppSelector(selectKeycloak);
  const navigate = useNavigate();
  const errorContext = useContext(ErrorContext);
  const [ usersGroups, setUsersGroups ] = useState<UserGroup[]>([]);
  const [ allGroups, setAllGroups ] = useState<UserGroup[]>([]);
  const [ filteredGroups, setFilteredGroups ] = useState<UserGroup[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ dialogStatus, setDialogStatus ] = useState<GroupDialogStatus>();
  const [ newGroupName, setNewGroupName ] = useState("");
  const [ groupSearch, setGroupSearch ] = useState("");
  const [ joinGroupCheckedItems, setJoinGroupCheckedItems ] = useState<CheckboxData[]>([]);
  const [ joinedGroup, setJoinedGroup ] = useState("");
  const [ groupNameError, setGroupNameError ] = useState(false);
  const [ pendingInvites, setPendingInvites ] = useState<GroupJoinInvite[]>([]);

  /**
   * Get list of all available groups
   * Get list of groups that user has member or admin role
   *
   */
  const loadGroups = async () => {
    if (!keycloak?.token || !keycloak?.tokenParsed) {
      return;
    }

    setLoading(true);
    try {
      setAllGroups(await Api.getUserGroupsApi(keycloak.token).listUserGroups({}));

      const foundGroupInvites = await Api.getGroupJoinInvitesApi(keycloak.token).listUserGroupJoinInvites();
      setPendingInvites(foundGroupInvites.filter(invite => invite.status === JoinRequestStatus.Pending));
      setFilteredGroups(allGroups);
      const initialCheckedItems = allGroups.map(group => ({
        name: group.name,
        checked: false
      }));
      setJoinGroupCheckedItems(initialCheckedItems);

      const foundGroupsAsMember = await Api.getUserGroupsApi(keycloak.token).listUserGroups({ member: true });
      const foundGroupsAsAdmin = await Api.getUserGroupsApi(keycloak.token).listUserGroups({ admin: true });
      const foundGroups = foundGroupsAsMember.concat(foundGroupsAsAdmin);

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
    loadGroups();
  }, []);

  /**
   * Set dialog status or navigate to surveys
   */
  const updateDialogStatus = () => {
    if (pendingInvites.length) {
      setDialogStatus(GroupDialogStatus.PENDING_INVITE);
    } else if (!usersGroups.length) {
      setDialogStatus(GroupDialogStatus.WELCOME);
    } else {
      navigate("/surveys");
    }
  };

  /**
   * Effect that updates dialog status
   */
  useEffect(() => {
    updateDialogStatus();
  }, [usersGroups]);

  /**
   * Handle new group name changes
   *
   * @param event event
   */
  const onNewGroupNameChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(target.value);
  };

  /**
   * Filters groups to join based on user input
   *
   * @param event event
   */
  const handleGroupSearchChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setGroupSearch(value);

    const filtered = allGroups.filter(group =>
      group.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  /**
   * Handle checkbox changes
   *
   * @param name group name
   */
  const handleCheckboxChange = (name: string) => {
    const newCheckedItems = joinGroupCheckedItems.map(item => {
      if (item.name.toLowerCase() === name.toLowerCase()) {
        item.checked = !item.checked;
        return item;
      }
      return item;
    });

    setJoinGroupCheckedItems(newCheckedItems);
  };

  /**
   * Gets the check box value based on checkbox name
   *
   * @param name checkbox group name
   */
  const getCheckedValue = (name: string) => {
    const checkbox = joinGroupCheckedItems.find(group => group.name.toLowerCase() === name.toLowerCase());

    if (!checkbox) return;

    return checkbox.checked;
  };

  /**
   * Creates a new user group
   */
  const createGroup = async () => {
    if (!newGroupName || !keycloak?.token) return;

    const nameAlreadyExists = allGroups.some(groups => groups.name.toLowerCase() === newGroupName.toLowerCase());
    if (nameAlreadyExists) {
      setGroupNameError(true);
      return;
    }

    setLoading(true);
    try {
      await Api.getUserGroupsApi(keycloak.token).createUserGroup({
        userGroup: {
          name: newGroupName
        }
      });
      setDialogStatus(GroupDialogStatus.CREATE_DONE);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupDialogsScreen.createGroup);
    }

    setNewGroupName("");
    setGroupNameError(false);
    setLoading(false);
  };

  /**
   * Creates a new join group request
   */
  const joinGroup = async () => {
    const groupsToJoin = joinGroupCheckedItems.filter(group => group.checked);
    // TODO: currently set so user can only join a single group
    const matchedGroup = allGroups.find(group => group.name.toLowerCase() === groupsToJoin[0].name.toLowerCase());

    if (!matchedGroup || !keycloak?.token || !keycloak?.tokenParsed) return;

    setJoinedGroup(matchedGroup?.name);

    // TODO: currently set up to only join one group at a time
    if (groupsToJoin.length !== 1) {
      errorContext.setError("Joining multiple groups not yet supported");
      return;
    }

    if (!matchedGroup?.id) return;

    setLoading(true);

    try {
      await Api.getGroupJoinRequestsApi(keycloak.token).createGroupJoinRequest({
        groupId: matchedGroup.id,
        groupJoinRequest: {
          email: keycloak.tokenParsed.email,
          groupId: matchedGroup.id
        }
      });

      setDialogStatus(GroupDialogStatus.REQUEST_SENT);
      setLoading(true);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupDialogsScreen.createGroupRequest);
    }
    setLoading(false);
  };

  /**
   * Accepts a group join invite
   */
  const acceptGroupInvite = async () => {
    if (!keycloak?.token || !keycloak?.tokenParsed) return;

    const { id, groupId } = pendingInvites[0];
    
    if (!id || !groupId) return;
    
    setLoading(true);
    try {
      await Api.getGroupJoinInvitesApi(keycloak.token).updateGroupJoinInvite({
        inviteId: id,
        groupId: groupId,
        groupJoinInvite: {
          status: JoinRequestStatus.Accepted,
          email: keycloak.tokenParsed.email,
          groupId: groupId
        }
      });
      setDialogStatus(GroupDialogStatus.INVITATION_ACCEPTED);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupDialogsScreen.acceptGroupInvite);
    }
    setLoading(false);
  };

  /**
   * Denies a group join invite
   */
  const denyGroupInvite = async () => {
    if (!keycloak?.token || !keycloak?.tokenParsed) return;

    const { id, groupId } = pendingInvites[0];

    if (!id || !groupId) return;

    setLoading(true);
    try {
      await Api.getGroupJoinInvitesApi(keycloak.token).updateGroupJoinInvite({
        inviteId: id,
        groupId: groupId,
        groupJoinInvite: {
          status: JoinRequestStatus.Rejected,
          email: keycloak.tokenParsed.email,
          groupId: groupId
        }
      });
      setDialogStatus(GroupDialogStatus.INVITATION_DENIED);
    } catch (error) {
      errorContext.setError(strings.errorHandling.groupDialogsScreen.denyGroupInvite);
    }
    setLoading(false);
  };

  /**
   * Get group name based on group id
   */
  const getGroupName = () => {
    const foundGroupName = allGroups.find(foundGroup => foundGroup.id === pendingInvites[0].groupId)?.name ?? "";
    return foundGroupName;
  };

  /**
   * Get group admin name based on group id
   */
  const getGroupAdminName = () => {
    const foundGroupAdminName = pendingInvites[0].metadata?.creatorId ?? "";
    return foundGroupAdminName;
  };

  /**
   * Renders the welcome dialog
   */
  const renderWelcomeDialog = () => (
    <GenericDialog
      error={ false }
      open
      onClose={ () => {} }
      onCancel={ () => setDialogStatus(GroupDialogStatus.JOIN) }
      onConfirm={ () => setDialogStatus(GroupDialogStatus.CREATE) }
      title={ strings.groupDialogsScreen.welcomeDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.createNewGroup }
      cancelButtonText={ strings.groupDialogsScreen.welcomeDialog.joinGroup }
      hideClose
    >
      <Typography>
        { strings.groupDialogsScreen.welcomeDialog.content }
      </Typography>
    </GenericDialog>
  );

  /**
   * Renders the create dialog
   */
  const renderCreateDialog = () => (
    <GenericDialog
      error={ false }
      open
      onClose={ () => {} }
      onCancel={ () => setDialogStatus(GroupDialogStatus.WELCOME) }
      onConfirm={ createGroup }
      title={ strings.groupDialogsScreen.createDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.createNewGroup }
      cancelButtonText={ strings.groupDialogsScreen.cancel }
      disabled={ !newGroupName }
      hideClose
    >
      <TextField
        fullWidth
        name="newGroupName"
        value={ newGroupName }
        placeholder={ strings.groupDialogsScreen.createDialog.placeholder }
        onChange={ onNewGroupNameChange }
        error={ groupNameError }
        helperText={ groupNameError && strings.groupDialogsScreen.createDialog.helperText }
      />
    </GenericDialog>
  );

  /**
   * Renders the create done dialog
   */
  const renderCreateDoneDialog = () => (
    <GenericDialog
      open
      onClose={ () => {} }
      onConfirm={ () => navigate("/surveys")}
      title={ strings.groupDialogsScreen.createDoneDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.createDoneDialog.goToGroupManagement }
      hideClose
    >
      <Typography>
        { strings.groupDialogsScreen.createDoneDialog.content }
      </Typography>
    </GenericDialog>
  );

  /**
   * Render the join group dialog
   */
  const renderJoinDialog = () => {
    const isChecked = joinGroupCheckedItems.some(item => item.checked);

    return (
      <GenericDialog
        error={ false }
        open
        onClose={ () => {} }
        onCancel={ () => setDialogStatus(GroupDialogStatus.WELCOME) }
        onConfirm={ joinGroup }
        title={ strings.groupDialogsScreen.joinDialog.title }
        positiveButtonText={ strings.groupDialogsScreen.joinDialog.sendRequest }
        cancelButtonText={ strings.groupDialogsScreen.createNewGroup }
        disabled={ !isChecked }
        hideClose
      >
        <Typography>
          { strings.groupDialogsScreen.joinDialog.content }
        </Typography>
        <TextField
          fullWidth
          name="joinGroupName"
          value={ groupSearch }
          placeholder={ strings.groupDialogsScreen.joinDialog.placeholder }
          onChange={ handleGroupSearchChange }
        />
        <List>
          { filteredGroups.map(group =>
            <ListItem key={ group.id }>
              <FormControlLabel
                label={ group.name }
                control={
                  <Checkbox
                    checked={ getCheckedValue(group.name) }
                    onChange={ () => handleCheckboxChange(group.name) }
                  />
                }
              />
            </ListItem>
          )}
        </List>
      </GenericDialog>
    );
  };

  /**
   * Render join request sent dialog
   */
  const renderRequestSentDialog = () => (
    <GenericDialog
      open
      onClose={ () => {} }
      onCancel={ () => setDialogStatus(GroupDialogStatus.CREATE) }
      onConfirm={ () => {} }
      title={ strings.groupDialogsScreen.requestSentDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.requestSentDialog.requestSent }
      cancelButtonText={ strings.groupDialogsScreen.createNewGroup }
      disabled
      hasIcon
      hideClose
    >
      <Typography>
        { strings.formatString(strings.groupDialogsScreen.requestSentDialog.content, joinedGroup) }
      </Typography>
    </GenericDialog>
  );

  /**
   * Render join request sent dialog
   */
  const renderPendingInviteDialog = () => (
    <GenericDialog
      open
      onClose={ () => {} }
      onCancel={ () => setDialogStatus(GroupDialogStatus.DENY_INVITATION_CONFIRM) }
      onConfirm={ () => acceptGroupInvite() }
      title={ strings.groupDialogsScreen.requestSentDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.pendingInviteDialog.acceptInvitation }
      cancelButtonText={ strings.groupDialogsScreen.pendingInviteDialog.denyInvitation }
      hideClose
    >
      <Typography>
        { strings.formatString(strings.groupDialogsScreen.pendingInviteDialog.content, getGroupName(), getGroupAdminName()) }
      </Typography>
    </GenericDialog>
  );

  /**
   * Renders the invitation accepted dialog
   */
  const renderInvitationAcceptedDialog = () => (
    <GenericDialog
      open
      onClose={ () => {} }
      // eslint-disable-next-line no-restricted-globals
      onConfirm={ () => loadGroups()}
      title={ strings.groupDialogsScreen.acceptedInviteDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.acceptedInviteDialog.continue }
      hideClose
    >
      <Typography>
        { strings.formatString(strings.groupDialogsScreen.acceptedInviteDialog.content, getGroupName()) }
      </Typography>
    </GenericDialog>
  );

  /**
   * Render join request sent dialog
   */
  const renderDenyInvitationConfirmDialog = () => (
    <GenericDialog
      open
      onClose={ () => {} }
      onCancel={ () => setDialogStatus(GroupDialogStatus.PENDING_INVITE) }
      onConfirm={ () => denyGroupInvite() }
      title={ strings.groupDialogsScreen.denyInviteConfirmDialog.title }
      positiveButtonText={ strings.groupDialogsScreen.denyInviteConfirmDialog.denyInvitation }
      cancelButtonText={ strings.generic.cancel }
      hideClose
    >
      <Typography>
        { strings.groupDialogsScreen.denyInviteConfirmDialog.content }
      </Typography>
    </GenericDialog>
  );

  /**
   * Renders the invitation denied dialog
   */
  const renderInvitationDeniedDialog = () => (
    <GenericDialog
      open
      onClose={ () => {} }
      onConfirm={ () => loadGroups()}
      title={ strings.groupDialogsScreen.invitationDeniedDialog.title }
      positiveButtonText={ String(strings.formatString(strings.groupDialogsScreen.invitationDeniedDialog.close, getGroupName())) }
      hideClose
    >
      <Typography>
        { strings.formatString(strings.groupDialogsScreen.invitationDeniedDialog.content, getGroupName()) }
      </Typography>
    </GenericDialog>
  );

  /**
   * Renders dialog based on dialog status
   */
  const renderGroupDialogContent = () => {
    switch (dialogStatus) {
      case GroupDialogStatus.WELCOME:
        return renderWelcomeDialog();
      case GroupDialogStatus.CREATE:
        return renderCreateDialog();
      case GroupDialogStatus.CREATE_DONE:
        return renderCreateDoneDialog();
      case GroupDialogStatus.JOIN:
        return renderJoinDialog();
      case GroupDialogStatus.REQUEST_SENT:
        return renderRequestSentDialog();
      case GroupDialogStatus.PENDING_INVITE:
        return renderPendingInviteDialog();
      case GroupDialogStatus.DENY_INVITATION_CONFIRM:
        return renderDenyInvitationConfirmDialog();
      case GroupDialogStatus.INVITATION_ACCEPTED:
        return renderInvitationAcceptedDialog();
      case GroupDialogStatus.INVITATION_DENIED:
        return renderInvitationDeniedDialog();
      default:
        return null;
    }
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
    <StackLayout title="">
      { renderGroupDialogContent() }
    </StackLayout>
  );
};

export default GroupDialogScreen;