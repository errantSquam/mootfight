// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import {useDocument, useCollection} from 'react-firebase-hooks/firestore'


const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_KEY as string)

const app = initializeApp(firebaseConfig);
const auth = getAuth()


var db = getFirestore(app)

type ToastResponse = {
    toastType: string,
    message: string,
    data?: any
}

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

const getUserInfo = async (uid?: string) => {

    if (auth.currentUser === null) {
        return null
    }
    if (uid === undefined) {
        uid = auth.currentUser.uid
    }
    let docRef = doc(db, "users", uid)
    let docSnap = await getDoc(docRef)
    return docSnap.data()
}

const getUserInfoHook = (uid?: string) => {
    if (auth.currentUser === null) {
        return null
    }
    if (uid === undefined) {
        uid = auth.currentUser.uid
    }

    return useDocument(doc(getFirestore(app), 'users', uid)
  )
}

const getUsers = async (limitAmount: number = 3) => {
    //possible issue. it DOES include the emails as well, which might be a privacy issue...
    let usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("username"), limit(limitAmount));
    const querySnapshot = await getDocs(q);
    return querySnapshot
}

const getUsersHook = (limitAmount: number = 3) => {
    let usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("username"), limit(limitAmount));
    const [snapshot, loading, error] = useCollection(q)
    return [snapshot, loading, error]
}

const updateUserInfo = async (toUpdate: any) => {
    if (auth.currentUser === null) {
        return {
            toastType: "error",
            message: "Not logged in!"
        }
    }

    let docRef = doc(db, "users", auth.currentUser.uid)
    let docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        updateDoc(docRef, toUpdate);

        return {
            toastType: "success",
            message: "Successfully updated info!"
        }
    }
    else {
        return {
            toastType: "error",
            message: "User does not exist."
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


export {
    signIn,
    auth,
    logOut,
    getUserInfo,
    getUserInfoHook,
    getUsers,
    getUsersHook,
    updateUserInfo
}