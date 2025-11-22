
import { ToastStatus } from "common";

import PocketBase, { ClientResponseError } from 'pocketbase';
import { type RecordModel } from "pocketbase";


const pb = new PocketBase('http://127.0.0.1:8090');

const handleError = (error: unknown): { toast_type: ToastStatus, message: string } => {
    if (error instanceof ClientResponseError) {
        console.log(error)
        console.log(error.data)

        return {
            toast_type: ToastStatus.ERROR,
            message: error.message
        }
    } else {
        console.log(error)
        return {
            toast_type: ToastStatus.ERROR,
            message: "UNKNOWN ERROR"

        }
    }
}


const checkLoggedIn = async () => {
    await pb.collection('users').authRefresh();

    if (pb.authStore.record === null) {
        return false
    }
    return true
}

const signIn = async (email: string, password: string): Promise<ToastResponse> => {
    try {

        const authData = await pb.collection('users').authWithPassword(
            email,
            password,
        );

        // after the above you can also access the auth data from the authStore
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.record?.id);
        console.log(authData)

        localStorage.setItem("token", authData.token)
        localStorage.setItem("userInfo", JSON.stringify(authData.record))

        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully logged in!"
        }
    } catch (error: unknown) {
        return handleError(error)
    }


}

const logOut = async () => {
    try {
        pb.authStore.clear()
        localStorage.removeItem("token")
        localStorage.removeItem("userInfo")
        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully signed out!"
        }

    }
    catch (error: unknown) {
        return handleError(error)

    }

}

const resetPassword = async (user_id:string, oldPassword: string, password: string, confirmPassword: string) => {
    await pb.collection("users").update(user_id, {
        oldPassword: oldPassword, // superusers and auth records with manager access can skip this
        password: password,
        passwordConfirm: confirmPassword,
    })
}

//we should refactor this into different API call files...
export {
    pb,
    checkLoggedIn,
    handleError,
    signIn,
    logOut
}