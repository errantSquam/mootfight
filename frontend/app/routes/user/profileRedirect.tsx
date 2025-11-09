import type { Route } from "../+types/home";
import { ProfileRedirectPage } from "~/pages/user/profileRedirect";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ProfileRedirect() {
  return <ProfileRedirectPage />;
}
