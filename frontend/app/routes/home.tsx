import type { Route } from "./+types/home";
import { Welcome } from "../pages/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
