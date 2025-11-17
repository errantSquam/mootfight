import type { Route } from "./+types/search";
import { Search } from "~/pages/search/search";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mootfight!" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Search />;
}
