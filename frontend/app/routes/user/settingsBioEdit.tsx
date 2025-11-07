import type { Route } from "../+types/home";
import { BioEditPage } from "~/pages/settings/settingsBioEdit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SettingsBio() {
  return <BioEditPage/>;
}
