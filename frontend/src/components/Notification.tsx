import { useDispatch, useSelector } from "react-redux";
import { X, CheckCircle, Bell } from "lucide-react";
import type { RootState, AppDispatch } from "../store/store";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../store/slices/notificationSlice";

interface NotificationProps {
  onClose: () => void;
}

const Notification = ({ onClose }: NotificationProps) => {
  const notifications = useSelector(
    (state: RootState) => state.notifications.list
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl border-l border-gray-100 flex flex-col z-50 animate-slideIn">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Mark All Button */}
      {notifications.length > 0 && (
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => dispatch(markAllNotificationsRead())}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium shadow hover:shadow-md transition-all duration-200"
          >
            Mark All as Read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 text-gray-300 mb-3" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  n.read
                    ? "bg-gray-50 border-gray-100 text-gray-500"
                    : "bg-white border-blue-100 shadow-sm hover:shadow-md"
                } flex items-center justify-between`}
              >
                <span
                  className={`text-sm ${
                    n.read ? "line-through text-gray-400" : "font-medium"
                  }`}
                >
                  {n.message}
                </span>
                {!n.read && (
                  <button
                    onClick={() => dispatch(markNotificationRead(n.id))}
                    className="ml-3 text-xs text-blue-600 font-medium hover:underline"
                  >
                    Mark Read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;

