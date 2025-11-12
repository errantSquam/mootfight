import type { Route } from "../+types/home";
import AttackPage from "~/pages/attack/attackView";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Attack() {
  return <AttackPage />;
}
