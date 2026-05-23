import { X } from "lucide-react";
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onMemberAdded: (newMember: any) => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  groupId,
  onMemberAdded,
}: AddMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/groups/${groupId}/add-member`, {
        email,
        role
      });
      onMemberAdded(res.data); // push new member into parent state
      setEmail("");
      setRole("member");
      onClose();
    } catch (err) {
      console.error("Error adding member", err);
    } finally {
      setLoading(false);
    }
  };
  
   if(isOpen){
    console.log("modal open ho bya")
   }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      {/* Modal Box */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Member</h2>

        <input
          type="email"
          placeholder="Enter member email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
         placeholder="Enter your role"
         value={role}
         onChange={(e)=>setRole(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"

        />

        <button
          onClick={handleAdd}
          disabled={loading}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
