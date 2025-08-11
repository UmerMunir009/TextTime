import { X } from "lucide-react";
import { authStore } from "../store/authStore";
import { useChatStore } from "../store/useChatStore";
import {Link} from 'react-router-dom'

const ChatHeader = () => {
  const { selectedUser, setSelectedUser,lastSeenMap } = useChatStore();
  const { onlineUsers } = authStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <Link to={'/user-profile'} className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.name} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.name}</h3>
            <p className="text-[10px] sm:text-xs text-base-content/70">
              {onlineUsers.includes(selectedUser.id)
                ? "Online"
                : `Last seen: ${lastSeenMap[selectedUser.id]}` || "Offline"}
            </p>
          </div>
        </Link>

        {/* Close button */}
        <button className="cursor-pointer" onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;