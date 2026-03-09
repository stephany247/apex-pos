import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/api/auth";
import { useStore } from "@/context/StoreContext";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, setUser } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.phoneNumber || "",
  );
  const [businessAddress, setBusinessAddress] = useState(
    currentUser?.businessAddress || "",
  );

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (result) => {
      setUser({
        ...currentUser!,
        name: fullName,
        phoneNumber,
        businessAddress,
      });
      onClose();
    },
    onError: (err: any) => {
      console.error("Failed to update profile:", err.message);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ fullName, phoneNumber, businessAddress });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
        <button
          type="button"
          aria-label="Close profile modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 bg-zinc-100 rounded-full"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="fullName"
              className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-zinc-50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phoneNumber"
              className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08012345678"
              className="w-full bg-zinc-50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="businessAddress"
              className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1"
            >
              Business Address
            </label>
            <input
              id="businessAddress"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="12 Marina Street, Lagos"
              className="w-full bg-zinc-50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-black text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              Failed to update profile. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
