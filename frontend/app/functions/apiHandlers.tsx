
import { updateUserInfo } from "~/api/userApi";
import { handleToast } from "./handleToast";

export async function updateUserSettings(data: UserAmbiguousSchema, refreshAuthUser: () => void) {
    let resp = await updateUserInfo(data)
    handleToast(resp)
    refreshAuthUser()
    if (resp.toast_type === "error") {
        return false
    }
    return true
}