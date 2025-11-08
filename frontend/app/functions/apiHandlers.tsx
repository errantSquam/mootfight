
import { updateUserInfo } from "~/api/firebase";
import { handleToast } from "./handleToast";

export async function updateUserSettings(data: UserAmbiguousSchema, refreshAuthUser: () => void) {
    let resp = await updateUserInfo(data)
    handleToast(resp)
    refreshAuthUser()
    return true
}