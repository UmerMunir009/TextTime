import { FolderPen } from "lucide-react";
import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const GroupPage = () => {
  const { users } = useChatStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListMModelOpen, setIsListMModelOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Handle checkbox toggle
  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle Done button click
  const handleDone = (e) => {
    e.preventDefault();
    console.log("Selected user IDs:", selectedUserIds);
    setIsListMModelOpen(false);
    setIsModalOpen(false);
  };


  return (
    <div className="h-screen bg-base-200">
      <div className="flex flex-col items-center justify-center pt-20 px-4 max-w-3xl mx-auto">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm cursor-pointer bg-blue-900 w-full rounded-sm py-2 mt-2"
        >
          Create New Group
        </button>

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
              <form>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium my-2">Group name</span>
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
                <div className="mt-5 flex justify-end space-x-2 border-t pt-3">
                  <button
                    onClick={() => setIsListMModelOpen(true)}
                    type="button"
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-800"
                    disabled={!name.trim()}
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
              </form>
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
                    <span className="label-text font-medium my-2">Group name</span>
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
                    <p className="text-center text-gray-500">No users available.</p>
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
                    Done
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
