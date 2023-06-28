import * as React from "react";
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
}

/**
 * Component for group routes
 */
const GroupRoutes: React.FC<Props> = ({ groupId, groupMembers, pendingRequests, pendingInvites }) => {
  if (!groupId) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="members"
        element={ <GroupMembers groupMembers={ groupMembers }/> }
      />
      <Route
        path="pendingInvites"
        element={ <PendingInvites pendingInvites={ pendingInvites }/> }
      />
      <Route
        path="pendingRequests"
        element={ <PendingRequests pendingRequests={ pendingRequests }/> }
      />
      <Route
        path="/"
        element={ <GroupMembers groupMembers={ groupMembers }/> }
      />
    </Routes>
  );
};

export default GroupRoutes;