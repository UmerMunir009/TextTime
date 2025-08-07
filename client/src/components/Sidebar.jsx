import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { authStore } from "../store/authStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Mail, Users } from "lucide-react";
import { toast } from "react-hot-toast";


const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    isAddingFriend,
    addNewFriend,
  } = useChatStore();
  const { onlineUsers } = authStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const validateForm = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const handleNewFriend = async(e) => {
    e.preventDefault();
    const success=validateForm()
    if(success){
    await addNewFriend(email);
    setEmail('')
    setIsModalOpen(false)
    }
  };

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className={`${selectedUser ? 'hidden' : ''} h-full sm:flex w-full sm:w-72 border-r border-base-300 flex flex-col transition-all duration-200`}>
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6  block" />
          <span className="font-medium block">Contacts</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xl cursor-pointer bg-blue-900 px-5 rounded-lg"
          >
            +
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center mx-5 ">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl p-5">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-white">
                    Connect with new friend
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleNewFriend}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium my-2">Email</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="size-5 text-base-content/40" />
                      </div>
                      <input
                        type="email"
                        className={`input input-bordered w-full pl-10`}
                        placeholder="abc@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end space-x-2 border-t pt-3">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-800"
                  >
                    {isAddingFriend?'Loading...':'Add'}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
                </form>

                {/* Modal Footer */}
                
              </div>
            </div>
          )}
        </div>
        {/*  Online filter toggle */}
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="flex-1  overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user?.id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex justify-start gap-3
              hover:bg-base-300 transition-colors cursor-pointer
              ${
                selectedUser?.id === user?.id
                  ? "bg-blue-900 ring-1 ring-blue-300 hover:bg-blue-900 transition-colors"
                  : ""
              }
            `}
          >
            <div className="relative  lg:mx-0">
              <img
                src={user?.profilePic || "/avatar.png"}
                alt={user?.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user?.id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className=" flex flex-col text-left min-w-0">
              <div className="font-medium truncate">{user?.name}</div>
              <div className="text-xs text-zinc-400">
                {onlineUsers.includes(user?.id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">Add friends to start</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
