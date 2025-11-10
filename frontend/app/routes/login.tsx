import type { Route } from "./+types/home";
import { Login } from "../pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Login />;
}
