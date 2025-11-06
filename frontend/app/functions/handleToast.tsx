import { toast } from "react-toastify"

export function handleToast(resp: any): void {
    if (resp.toastType === "success") {
        toast.success(resp.message)

    } else if (resp.toastType === "error") {
        toast.error(resp.message)
    }
}