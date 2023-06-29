import { Box, Checkbox, CircularProgress, FormControlLabel, List, ListItem, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import GenericDialog from "components/generic/generic-dialog";
import StackLayout from "components/layouts/stack-layout";
import { selectKeycloak } from "features/auth-slice";
import strings from "localization/strings";
import React, { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import Api from "api";
import { UserGroup } from "generated/client";
import { CheckboxData, GroupDialogStatus } from "types";
import { ErrorContext } from "components/error-handler/error-handler";
import { useNavigate } from "react-router-dom";
import { setUserGroups } from "features/group-slice";

/**
 * Group dialog screen component
 */
const GroupDialogScreen: FC = () => {
  const dispatch = useAppDispatch();
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

  /**
   * Gets all groups and groups user is group admin of
   *
   * @returns list of groups and groups user is admin of
   */
  const loadGroups = async () => {
    if (!keycloak?.token || !keycloak?.tokenParsed) {
      return;
    }

    setLoading(true);
    try {
      const foundAllGroups = await Api.getUserGroupsApi(keycloak.token).listUserGroups({
        adminEmail: undefined
      });

      setAllGroups(foundAllGroups);
      setFilteredGroups(foundAllGroups);
      const initialCheckedItems = foundAllGroups.map(group => ({
        name: group.name,
        checked: false
      }));
      setJoinGroupCheckedItems(initialCheckedItems);

      const foundGroups = await Api.getUserGroupsApi(keycloak.token).listUserGroups({
        adminEmail: keycloak.tokenParsed.email
      });
      setUsersGroups(foundGroups);
      dispatch(setUserGroups(foundGroups));
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
   * Set dialog status or navigate to group mmanagement
   */
  const updateDialogStatus = () => {
    if (!usersGroups.length) {
      setDialogStatus(GroupDialogStatus.WELCOME);
    } else {
      // TODO: Surveys should be the route and group management is accesed from the nav button.
      navigate(`/groups/${usersGroups[0].id}`);
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
      const createdGroup = await Api.getUserGroupsApi(keycloak.token).createUserGroup({
        userGroup: {
          name: newGroupName
        }
      });
      dispatch(setUserGroups([...usersGroups, createdGroup]));
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
      onConfirm={ () => navigate(`/groups/${usersGroups[0].id}`)}
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
      onCancel={ () => setDialogStatus(GroupDialogStatus.WELCOME) }
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