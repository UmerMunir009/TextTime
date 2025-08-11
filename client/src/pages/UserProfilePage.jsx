import { useState } from "react";
import { useAuth } from "../customHooks/useAuth";
import { useChatStore } from "../store/useChatStore";
import { authStore } from "../store/authStore";
import { Camera, Mail, User } from "lucide-react";

const UserProfilePage = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = authStore();
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">
              {selectedUser?.name}'s Profile
            </h1>
          </div>

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                onClick={() => setSelectedImage(selectedUser?.profilePic)}
                src={selectedUser?.profilePic || "/avatar.png"}
                className="size-32 rounded-full object-cover cursor-pointer border-4"
              />
              {selectedImage && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                  onClick={() => setSelectedImage(null)}
                >
                  <img
                    src={selectedImage}
                    alt="Full View"
                    className="max-w-full max-h-full rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedUser?.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {selectedUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{selectedUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span
                  className={`${
                    onlineUsers.includes(selectedUser?.id)
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {onlineUsers.includes(selectedUser?.id)
                    ? "Active"
                    : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
