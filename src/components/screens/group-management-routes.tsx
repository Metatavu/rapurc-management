import React, { Dispatch, FC, SetStateAction } from "react";
import { Route, Routes } from "react-router-dom";
import GroupMembers from "components/group/group-members";
import PendingInvites from "components/group/pending-invites";
import PendingRequests from "components/group/pending-requests";
import { GroupJoinInvite, GroupJoinRequest, User } from "generated/client";

/**
 * Component properties
 */
interface Props {
  groupId?: string;
  groupMembers: User[];
  pendingRequests: GroupJoinRequest[];
  pendingInvites: GroupJoinInvite[];
  deletePendingInvite: (inviteId: string) => Promise<void>;
  setPendingRequests: Dispatch<SetStateAction<GroupJoinRequest[]>>;
  setGroupMembers: Dispatch<SetStateAction<User[]>>;
}

/**
 * Component for group routes
 *
 * @param props component properties
 */
const GroupRoutes: FC<Props> = ({
  groupId,
  groupMembers,
  pendingRequests,
  pendingInvites,
  setPendingRequests,
  setGroupMembers,
  deletePendingInvite
}) => {
  if (!groupId) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="members"
        element={ <GroupMembers setGroupMembers={ setGroupMembers } groupMembers={ groupMembers }/> }
      />
      <Route
        path="pendingInvites"
        element={ <PendingInvites pendingInvites={ pendingInvites } deletePendingInvite={ deletePendingInvite }/> }
      />
      <Route
        path="pendingRequests"
        element={ <PendingRequests setPendingRequests={ setPendingRequests } pendingRequests={ pendingRequests }/> }
      />
      <Route
        path="/"
        element={ <GroupMembers setGroupMembers={ setGroupMembers } groupMembers={ groupMembers }/> }
      />
    </Routes>
  );
};

export default GroupRoutes;