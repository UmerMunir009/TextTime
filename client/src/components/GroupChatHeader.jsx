import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import {Link} from 'react-router-dom'

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup,groupMembers } = useChatStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <Link to={'/group-info'} className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedGroup?.group_icon || "/avatar.png"} alt={selectedGroup?.name} />
            </div>
          </div>

          {/* group info */}
          <div>
            <h3 className="font-medium">{selectedGroup?.name}</h3>
            <p>Memberssss</p>
           
          </div>
        </Link>

        {/* Close button */}
        <button className="cursor-pointer" onClick={() => setSelectedGroup(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default GroupChatHeader;