import type { Route } from "../+types/home";
import { ProfilePage } from "~/pages/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Profile() {
  return <ProfilePage />;
}
