import React, { useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, setUser } = useStore();

  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.phoneNumber || "",
  );
  const [businessAddress, setBusinessAddress] = useState(
    currentUser?.businessAddress || "",
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      fullName,
      phoneNumber,
      businessAddress,
    };

    console.log("Update profile", payload);

    // call API here later
    setUser({
      ...currentUser!,
      name: fullName,
    });

    onClose();
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
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-zinc-50 rounded-xl p-3 outline-none"
          />

          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
            className="w-full bg-zinc-50 rounded-xl p-3 outline-none"
          />

          <input
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            placeholder="Business address"
            className="w-full bg-zinc-50 rounded-xl p-3 outline-none"
          />

          <button className="w-full bg-black text-white py-3 rounded-xl font-bold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
