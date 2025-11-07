import type { Route } from "../+types/home";
import { getUserInfoHook } from "~/api/firebase";
import { ProfileRedirectPage } from "~/pages/profileRedirect";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ProfileRedirect() {
  return <ProfileRedirectPage />;
}
