import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import {Link} from 'react-router-dom'

const GroupChatHeader = () => {
  const { selectedGroup, setSelectedGroup,groupMembers } = useChatStore();
   const displayedMembers = groupMembers.slice(0, 3).map(member => member?.name);
  const more = groupMembers.length - displayedMembers.length;

  return (
    <div className="p-2.5 border-b border-base-300 bg-blue-900">
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
             <p className="text-xs text-gray-400 truncate max-w-xs">
              {displayedMembers.join(", ")}
              {more > 0 && `, ...`}
            </p>
           
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