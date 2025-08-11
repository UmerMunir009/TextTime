import { FolderPen, Mail } from "lucide-react";
import React, { useState } from "react";

const GroupPage = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [name, setName] = useState('');
    
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
         <button
            onClick={()=>setIsModalOpen(true)}
            className="text-sm cursor-pointer bg-blue-900 w-[100%] rounded-sm py-2 mt-2"
          >
            Create New Group
          </button>
           {isModalOpen && (
            <div className="fixed inset-0 z-50 flex justify-center items-center mx-5 ">
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
                <form >
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
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end space-x-2 border-t pt-3">
                  <button
                    type="submit"
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-800"
                  >
                    Create
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
    </div>
  );
};

export default GroupPage;
