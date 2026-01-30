export const mockNotifications = {
  total: 50,
  tasks: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Task ${i + 1} — Review Shipment Plan`,
    priority: ["low", "medium", "high"][i % 3],
    full_name: ["Manager", "Supervisor", "Admin"][i % 3],
    status: i % 3 === 0 ? "assigned" : i % 3 === 1 ? "in_progress" : "completed",
    description: `
### Task Instructions

Please review the logistics plan.

**Steps:**
- Validate route
- Check fuel cost
- Approve dispatch

_Task ID: ${i + 1}_
    `,
    notification_count: Math.floor(Math.random() * 5),
  })),
};
