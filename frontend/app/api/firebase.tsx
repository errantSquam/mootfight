// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_KEY as string)

const app = initializeApp(firebaseConfig);
const auth = getAuth()

var db = getFirestore(app)

type ToastResponse = {
    toastType: string,
    message: string
}

const signIn = async (email: string, password: string): Promise<ToastResponse> => {
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let userUid = userCredential.user.uid;
        let docRef = doc(db, "users", userUid)

        let docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {

            setDoc(docRef, {
                email: email,
                username: email,

            });
        }
        return {
            toastType: "success",
            message: "Successfully logged in!"
        }
    } catch (error: unknown) {
        if (error instanceof FirebaseError) {
            console.log(`GOT ERROR: ` + error.code)

            let errorMessage = "ERROR:" + error.code
            if (error.code === "auth/invalid-credential") {
                errorMessage = "Invalid email or password."
            }

            return {
                toastType: "error",
                message: errorMessage
            }
        } else {
            return {
                toastType: "error",
                message: "UNKNOWN ERROR"

            }
        }
    }


}

export {
    signIn,
    auth
}