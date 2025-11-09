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
        route("profile/:username", "routes/user/profileRedirect.tsx"),
        route("profile/:username/:userId", "routes/user/profile.tsx"),

    ],
    

    )

] satisfies RouteConfig;
