import * as React from "react";
import { Route, Routes } from "react-router-dom";
import GroupMembers from "components/group/group-members";
import PendingInvites from "components/group/pending-invites";
import PendingRequests from "components/group/pending-requests";

/**
 * Component properties
 */
interface Props {
  groupId?: string;
}

/**
 * Component for group routes
 */
const GroupRoutes: React.FC<Props> = ({ groupId }) => {
  if (!groupId) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="members"
        element={ <GroupMembers groupId={ groupId }/> }
      />
      <Route
        path="pendingInvites"
        element={ <PendingInvites groupId={ groupId }/> }
      />
      <Route
        path="pendingRequests"
        element={ <PendingRequests groupId={ groupId }/> }
      />
    </Routes>
  );
};

export default GroupRoutes;