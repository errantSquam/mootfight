import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    ...prefix("submit", [
        route("attack", "routes/submit/submit_attack.tsx")
    ]),
    ...prefix("user",[
        route("settings", "routes/user/settings.tsx"),
        route("profile/:username", "routes/user/profile.tsx")
    ],
    

    )

] satisfies RouteConfig;
