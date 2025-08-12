import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const GroupInfoPage = () => {
  const { selectedGroup, updatingGroupInfo, groupMembers } = useChatStore();
  const members=groupMembers
  const [picPreview, setPicPreview] = useState("");
  const [picFile, setPicFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPicPreview(URL.createObjectURL(file));
      setPicFile(file);
    }
  };

  const handleImageUpload = async () => {
    if (!picFile) return;

    const formData = new FormData();
    formData.append("image", picFile);

    await updateProfile(formData);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Group Info</h1>
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={picPreview || selectedGroup?.group_icon || "/avatar.png"}
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    updatingGroupInfo ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={updatingGroupInfo}
                />
              </label>
            </div>
            <button
              onClick={handleImageUpload}
              className={`p-3 ${
                picPreview ? "bg-green-500" : "bg-gray-700 "
              } rounded-lg text-white ${
                picFile ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!picFile || updatingGroupInfo}
            >
              {updatingGroupInfo ? "Updating..." : "Change"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedGroup?.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Description
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedGroup?.description}
              </p>
            </div>
          </div>
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Group Members</h2>
            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {
                [...members]
                  .sort((a, b) => {
                    const isAdminA = a.email === selectedGroup?.creator?.email;
                    const isAdminB = b.email === selectedGroup?.creator?.email;
                    return isAdminA === isAdminB ? 0 : isAdminA ? -1 : 1;
                  })
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-2 rounded-lg bg-base-200 hover:bg-base-100 transition-colors"
                    >
                      <img
                        src={member.profilePic || "/avatar.png"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-sm text-gray-400">
                          {member.email}
                        </span>
                      </div>
                      {selectedGroup?.creator?.email === member?.email && (
                        <div className="bg-green-900 text-white p-1 rounded text-xs">
                          Admin
                        </div>
                      )}
                    </div>
                  ))
              }
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Creation details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Created At</span>
                <span>{selectedGroup?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-[8px] sm:text-sm">
                <span>Created By: </span>
                <span className="text-green-500">
                  {selectedGroup?.creator?.name} ||{" "}
                  {selectedGroup?.creator?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoPage;
