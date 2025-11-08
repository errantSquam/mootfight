import type { Route } from "../+types/home";
import { ProfilePage } from "~/pages/user/profile";
import { getUserInfoHook } from "~/api/firebase";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Profile() {
  return <ProfilePage />;
}
