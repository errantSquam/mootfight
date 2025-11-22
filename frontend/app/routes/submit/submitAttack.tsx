import type { Route } from "../+types/home";
import { SubmitAttackPage } from "~/pages/submit/submitAttack";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Submit Attack" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SubmitAttack() {
  return <SubmitAttackPage />;
}
