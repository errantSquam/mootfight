import type { Route } from "../+types/home";
import { SubmitCharacterPage } from "~/pages/submit/submitCharacter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Submit Character" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function SubmitCharacter() {
  return <SubmitCharacterPage/>;
}
