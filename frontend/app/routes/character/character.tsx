import type { Route } from "../+types/home";
import CharacterPage from "~/pages/character/characterProfile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Character() {
  return <CharacterPage />;
}
