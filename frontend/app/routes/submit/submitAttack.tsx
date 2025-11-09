import type { Route } from "../+types/home";
import { SubmitAttackPage } from "~/pages/submit/submitAttack";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SubmitAttack() {
  return <SubmitAttackPage />;
}
