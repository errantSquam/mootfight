import { toast } from "react-toastify/unstyled"

export function handleToast(resp: ToastResponse): void {
    if (resp.toast_type === "success") {
        toast.success(resp.message)

    } else if (resp.toast_type === "error") {
        toast.error(resp.message)
    }
}