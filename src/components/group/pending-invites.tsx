import React, { FC } from "react";

/**
 * Component properties
 */
interface Props {
  groupId?: string;
}

/**
 * Component for pending invites
 */
const PendingInvites: FC<Props> = ({ groupId }) => {
  console.log(groupId);

  return (
    <div>PendingInvites</div>
  );
};

export default PendingInvites;