import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
// import { getRequest, postRequest } from "../api/api_call";
// import { API_ENDPOINTS } from "../api/api_endpoints";
// import { marked } from "marked";
import { mockNotifications } from "../mock/mockNotifications";
const USE_STATIC_DATA = true;
/* ---------- Types ---------- */
interface User {
  id: Number;
  name: string;
}

interface Notification {
  id: number;
  title: string;
  priority: string;
  from: string;
  status: string;
  description: string;
  notification_count: number;
  disabled?: boolean;
}

/* ---------- Props ---------- */
interface Props {
  user: User | null;
  handleShowNotifications: () => void;
  notificationCount: number;
  setNotificationCount: (notification_count: number) => void;
  pendingTasks: any;
  setPendingTasks: (pendingTasks: any) => void;
}

const TaskNotificationsPaging: React.FC<Props> = ({
  user,
  handleShowNotifications,
}) => {
  const LIMIT = 8;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [messageHtmlMap, setMessageHtmlMap] = useState<Record<number, string>>(
    {}
  );

  const notificationsRef = useRef<Notification[]>([]);
  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);

  /* ---------------- Toggle ---------------- */
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /* ---------------- Markdown Rendering ---------------- */
  useEffect(() => {
    notificationsRef.current = notifications;

    const htmlMap: Record<number, string> = {};
    notifications.forEach((msg) => {
      try {
        htmlMap[msg.id] = marked.parse(
          msg.description?.replace(/\n/g, "<br/>") || ""
        );
      } catch {
        htmlMap[msg.id] = "<p>⚠️ Failed to render message</p>";
      }
    });

    setMessageHtmlMap(htmlMap);
  }, [notifications]);

  /* ---------------- Fetch Notifications ---------------- */
//   const fetchUnreadNotifications = async () => {
//     if (isFetchingRef.current || !hasMoreRef.current) return;

//     isFetchingRef.current = true;
//     setIsLoading(true);

//     try {
//       const url = `${API_ENDPOINTS.get_notifications_by_user_with_paging}?offset=${offsetRef.current}&limit=${LIMIT}`;

//       const res = await getRequest(url);

//       const existing = notificationsRef.current;
//       const existingIds = new Set(existing.map((n) => n.id));

//       const newNotifications =
//         res?.data.tasks
//           ?.filter((t: any) => !existingIds.has(t.id))
//           .map((t: any) => ({
//             id: t.id,
//             title: t.title,
//             priority: t.priority,
//             from: t.full_name,
//             status: t.status,
//             description: t.description,
//             notification_count: t.notification_count,
//             disabled: false,
//           })) || [];

//       const updated = [...existing, ...newNotifications];

//       setNotifications(updated);
//       notificationsRef.current = updated;

//       offsetRef.current += LIMIT;

//       const total = res?.data.total ?? 0;
//       if (updated.length >= total) {
//         hasMoreRef.current = false;
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       isFetchingRef.current = false;
//       setIsLoading(false);
//     }
//   };
const fetchUnreadNotifications = async () => {
  if (isFetchingRef.current || !hasMoreRef.current) return;

  isFetchingRef.current = true;
  setIsLoading(true);

  try {
    let res;

    if (USE_STATIC_DATA) {
      // 🟦 STATIC MODE
      await new Promise((r) => setTimeout(r, 500)); // simulate delay

      const start = offsetRef.current;
      const end = start + LIMIT;

      res = {
        data: {
          total: mockNotifications.total,
          tasks: mockNotifications.tasks.slice(start, end),
        },
      };
    } else {
      // 🟢 API MODE
    //   const url = `${API_ENDPOINTS.get_notifications_by_user_with_paging}?offset=${offsetRef.current}&limit=${LIMIT}`;
    //   res = await getRequest(url);
    }

    const existing = notificationsRef.current;
    const existingIds = new Set(existing.map((n) => n.id));

    const newNotifications =
      res?.data.tasks
        ?.filter((t: any) => !existingIds.has(t.id))
        .map((t: any) => ({
          id: t.id,
          title: t.title,
          priority: t.priority,
          from: t.full_name,
          status: t.status,
          description: t.description,
          notification_count: t.notification_count,
          disabled: false,
        })) || [];

    const updated = [...existing, ...newNotifications];

    setNotifications(updated);
    notificationsRef.current = updated;

    offsetRef.current += LIMIT;

    if (updated.length >= res.data.total) {
      hasMoreRef.current = false;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isFetchingRef.current = false;
    setIsLoading(false);
  }
};
  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  /* ---------------- Infinite Scroll ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200;

      if (nearBottom) fetchUnreadNotifications();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- Actions ---------------- */
  async function acceptNotification(task_id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === task_id ? { ...n, disabled: true } : n))
    );

    await postRequest(API_ENDPOINTS.accept_task.replace("task_id", String(task_id)), { task_id });

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === task_id ? { ...n, status: "in_progress", disabled: false } : n
      )
    );
  }

  async function changeTaskStatus(task_id: number) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === task_id ? { ...n, disabled: true } : n))
    );

    await postRequest(`${API_ENDPOINTS.change_task_status}${task_id}/status`, {
      status: "completed",
      notes: "completed",
    });

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === task_id ? { ...n, status: "completed", disabled: false } : n
      )
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="notifications-panel">
      <div className="notifications-header flex justify-between items-center">
        <h3>📬 Task Notifications</h3>
        <button onClick={handleShowNotifications}>
          <X size={20} />
        </button>
      </div>

      {notifications.map((task, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={task.id} className="notification-card">
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => toggleAccordion(index)}
            >
              <h4>{task.title}</h4>
              <ChevronDown
                size={18}
                className={`transition ${isOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isOpen && (
              <div className="px-2">
                <p>
                  Assigned by: <strong>{task.from}</strong>
                </p>

                <div
                  dangerouslySetInnerHTML={{
                    __html: messageHtmlMap[task.id] || "Loading...",
                  }}
                />

                <div className="actions mt-2">
                  {task.status === "assigned" && (
                    <button
                      disabled={task.disabled}
                      onClick={() => acceptNotification(task.id)}
                    >
                      {task.disabled ? "Processing..." : "✓ Accept"}
                    </button>
                  )}

                  {task.status === "in_progress" && (
                    <button
                      disabled={task.disabled}
                      onClick={() => changeTaskStatus(task.id)}
                    >
                      {task.disabled
                        ? "Processing..."
                        : "✓ Mark Task as Completed"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {isLoading && <p className="text-center py-3">Loading...</p>}
      {!hasMoreRef.current && (
        <p className="text-center text-gray-400 py-3">No more tasks</p>
      )}
    </div>
  );
};

export default TaskNotificationsPaging;
