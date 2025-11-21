
import { ToastStatus } from "common";

import PocketBase from 'pocketbase';


const pb = new PocketBase('http://127.0.0.1:8090');

const handleError = (error: unknown): { toast_type: ToastStatus, message: string } => {
    if (error instanceof String) {
        /*console.log(`GOT ERROR: ` + error.code)

        let errorMessage = "ERROR: " + error.code
        if (error.code === "auth/invalid-credential") {
            errorMessage = "Invalid email or password."
        }*/

        return {
            toast_type: ToastStatus.ERROR,
            message: ''
        }
    } else {
        console.log(error)
        return {
            toast_type: ToastStatus.ERROR,
            message: "UNKNOWN ERROR"

        }
    }
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

        let userId = authData.record.id

        /*

        let { data, error } = await supabase.auth.signInWithPassword({
            email: 'someone@email.com',
            password: 'LdUhMWGpKZKSdodrLJBe'
        })
        
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let userUid = userCredential.user.user_id;

        const snap = await getCountFromServer(query(
            collection(db, 'users'), where(documentId(), '==', userUid)
        ))
        if (snap.data().count === 0) {
            let docRef = doc(db, "users", userUid)
            setDoc(docRef, {
                username: `User #${Math.floor(Math.random() * 100)}`,
                user_id: userUid

            });
        }*/

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
        //await signOut(auth)
        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully signed out!"
        }

    }
    catch (error: unknown) {
        return handleError(error)

    }

}

//we should refactor this into different API call files...
export {
    pb,
    handleError,
    signIn,
    logOut
}