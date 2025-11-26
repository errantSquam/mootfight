import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    ...prefix("submit", [
        route("attack", "routes/submit/submitAttack.tsx"),
        route("character", "routes/submit/submitCharacter.tsx")
    ]),
    ...prefix("user",[
        route("settings", "routes/user/settings.tsx"),
        route("settings/bio", "routes/user/settingsBioEdit.tsx"),
        route("notifications", "routes/user/notifs.tsx"),
        route("profile/:username", "routes/user/profile.tsx"),
        route("id/:id", "routes/user/profileId.tsx"),
    ]),
    ...prefix("character", [
        route(":characterId", "routes/character/character.tsx")
    ]),
    ...prefix("attack", [
        route(":attackId", "routes/attack/attack.tsx")
    ]),
    ...prefix("comment", [
        route(":commentId", "routes/comments/viewComment.tsx")
    ]),
    route("search", "routes/search/search.tsx")

] satisfies RouteConfig;
