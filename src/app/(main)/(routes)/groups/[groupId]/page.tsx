import { FC } from "react";

interface GroupIdProps {
  params: { groupId: string }
}

const GroupIdPage: FC<GroupIdProps> = ({ params }) => {
  return (
    <div>
      {params.groupId}
    </div>
  );
}
 
export default GroupIdPage;