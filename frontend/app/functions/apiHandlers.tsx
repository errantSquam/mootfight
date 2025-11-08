
import { updateUserInfo } from "~/api/firebase";
import { handleToast } from "./handleToast";

export async function updateUserSettings(data: any, refreshAuthUser: any) {
    let resp = await updateUserInfo(data)
    handleToast(resp)
    refreshAuthUser()
    return true
}