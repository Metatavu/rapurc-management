import React, { FC } from "react";

/**
 * Component properties
 */
interface Props {
  groupId?: string;
}

/**
 * Component for pending requests
 */
const PendingRequests: FC<Props> = ({ groupId }) => {
  console.log(groupId);

  return (
    <div>PendingRequests</div>
  );
};

export default PendingRequests;