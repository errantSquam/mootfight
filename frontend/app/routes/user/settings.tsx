import type { Route } from "../+types/home";
import { SettingsPage } from "~/pages/user/settings/settings";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Settings() {
  return <SettingsPage />;
}
