import React, { FC } from "react";

/**
 * Component properties
 */
interface Props {
  groupId?: string;
}

/**
 * Component for Group Members
 */
const GroupMembers: FC<Props> = ({ groupId }) => {
  console.log(groupId);

  return (
    <div>GroupMembers</div>
  );
};

export default GroupMembers;