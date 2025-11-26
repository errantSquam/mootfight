import type { Route } from "../+types/home";
import { ViewMoreCommentPage } from "~/pages/comments/commentViewMore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Viewing Comment" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function ViewComment() {
  return <ViewMoreCommentPage/>;
}
