import type { Route } from "../+types/home";
import { ProfilePage } from "~/pages/user/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "(User)'s Profile" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Profile() {
  return <ProfilePage />;
}
