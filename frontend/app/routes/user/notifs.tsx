import type { Route } from "../+types/home";
import { NotificationsPage } from "~/pages/user/notifs/notifications";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Notifications" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Settings() {
  return <NotificationsPage />;
}
