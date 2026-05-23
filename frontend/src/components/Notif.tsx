import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import type { RootState } from "../store/store";
import { fetchNotifications } from "../store/slices/notificationSlice";
import Notification from "./Notification";

const Notif = () => {
  const [open, setOpen] = useState(false);
  const notifications = useSelector(
    (state: RootState) => state.notifications.list
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNotifications(5) as any);

    // Poll every 20s instead of 1s
    const interval = setInterval(() => {
      dispatch(fetchNotifications(5) as any);
    }, 20000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-xs font-semibold flex items-center justify-center bg-red-500 text-white rounded-full shadow-md">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 flex z-50">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>

          {/* Slide-in Panel */}
          <div className="ml-auto w-80 max-w-sm bg-white shadow-xl h-full p-6 animate-slideIn">
            <Notification onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default Notif;

