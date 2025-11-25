import type { Route } from "../+types/home";
import { ProfilePage } from "~/pages/user/profile";
import { useParams } from "react-router";
import { ProfileIdRedirect } from "~/pages/user/profile copy";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "(User)'s Profile" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ProfileId() {    
  return <ProfileIdRedirect/>;
}
