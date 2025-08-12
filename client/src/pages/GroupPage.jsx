import { FolderPen } from "lucide-react";
import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { authStore } from "../store/authStore";
import { useEffect } from "react";
import GroupChatContainer from "../components/GroupChatContainer";

const GroupPage = () => {
  const {
    users,
    getUsers,
    createNewGroup,
    isCreatingGroup,
    getUserGroups,
    groups,
    selectedGroup,
    setSelectedGroup,
  } = useChatStore();
  const { authUser, socket } = authStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListMModelOpen, setIsListMModelOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleDone = async (e) => {
    e.preventDefault();
    await createNewGroup({ name, description, members: selectedUserIds });
    setIsListMModelOpen(false);
    setIsModalOpen(false);
    setName("");
    setDescription("");
    setSelectedUserIds([]);
    getUserGroups(); //fetching groups again after group creation
    
  };
  useEffect(() => {
    getUserGroups();
    getUsers();
  }, []);

  if (selectedGroup) {
    return <GroupChatContainer />;
  }

  return (
    <div className="h-screen ">
      <div className="flex flex-col  justify-start pt-20 px-4 max-w-5xl mx-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm cursor-pointer bg-blue-700 w-full rounded-sm py-2 mt-2"
        >
          Create New Group
        </button>
        <h1
          className={`${
            groups.length === 0 ? "mt-8 text-xl hidden" : "mt-8 text-xl"
          }`}
        >
          Groups
        </h1>
        <div className="flex-1  overflow-y-auto w-full py-3">
          {groups.map((group) => (
            <button
              key={group?.id}
              onClick={() => setSelectedGroup(group)}
              className={`
              w-full p-3 flex justify-start items-center gap-3
              hover:bg-blue-900 transition-colors cursor-pointer
              ${
                selectedGroup?.id === group?.id
                  ? "bg-blue-900 ring-1 ring-blue-300 hover:bg-blue-900 transition-colors"
                  : ""
              }
            `}
            >
              <img
                src={group?.group_icon || "/avatar.png"}
                alt={group?.name}
                className="size-12 object-cover rounded-full"
              />
              <div className="font-medium truncate">{group?.name}</div>
            </button>
          ))}

          {groups.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              Create group to start group chatting
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center mx-5">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl p-5">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Group
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium my-2">
                      Group name
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FolderPen className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="example"
                      value={name}
                      required={true}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium my-2">
                      Description
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FolderPen className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="chat group"
                      value={description}
                      required={true}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end space-x-2 border-t pt-3">
                  <button
                    onClick={() => setIsListMModelOpen(true)}
                    type="button"
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-800"
                    disabled={!name.trim() || !description.trim()}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isListMModelOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-center mx-5 overflow-auto max-h-[90vh]">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl p-5">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-sm sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Choose members to add
                </h3>
                <button
                  onClick={() => setIsListMModelOpen(false)}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleDone}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium my-2">
                      Group name
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FolderPen className="size-5 text-base-content/40" />
                    </div>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10`}
                      placeholder="example"
                      value={name}
                      readOnly
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border rounded-md p-2">
                  {users?.length === 0 ? (
                    <p className="text-center text-gray-500">
                      No users available.
                    </p>
                  ) : (
                    users.map((user) => (
                      <label
                        key={user?.id}
                        className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="checkbox checkbox-sm"
                        />
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <img
                            src={"/avatar.png"}
                            alt={user?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            {user?.email}
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <div className="mt-5 flex justify-end space-x-2 border-t pt-3">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-800"
                    disabled={selectedUserIds.length === 0}
                  >
                    {isCreatingGroup ? "Loading..." : "Done"}
                  </button>
                  <button
                    onClick={() => setIsListMModelOpen(false)}
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
