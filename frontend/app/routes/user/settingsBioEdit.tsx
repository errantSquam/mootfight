import type { Route } from "../+types/home";
import { BioEditPage } from "~/pages/user/settings/settingsBioEdit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SettingsBio() {
  return <BioEditPage/>;
}
