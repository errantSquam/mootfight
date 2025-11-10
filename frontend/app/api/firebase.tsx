import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';


const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_KEY as string)

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const db = getFirestore(app)


const handleError = (error: unknown) => {
    if (error instanceof FirebaseError) {
        console.log(`GOT ERROR: ` + error.code)

        let errorMessage = "ERROR: " + error.code
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


const signIn = async (email: string, password: string): Promise<ToastResponse> => {
    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        let userUid = userCredential.user.uid;

        const snap = await getCountFromServer(query(
            collection(db, 'users'), where(documentId(), '==', userUid)
        ))
        if (snap.data().count === 0) {
            let docRef = doc(db, "users", userUid)
            setDoc(docRef, {
                email: email,
                username: `User #${Math.floor(Math.random() * 100)}`,
                uid: userUid

            });
        }
        return {
            toastType: "success",
            message: "Successfully logged in!"
        }
    } catch (error: unknown) {
        return handleError(error)
    }


}

const logOut = async () => {
    try {
        await signOut(auth)
        return {
            toastType: "success",
            message: "Successfully signed out!"
        }

    }
    catch (error: unknown) {
        return handleError(error)

    }

}

//we should refactor this into different API call files...
export {
    app,
    auth,
    db,
    handleError,
    signIn,
    logOut
}