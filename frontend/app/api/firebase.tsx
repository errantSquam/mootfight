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

const createCharacter = async (data: CharacterSchema) => {
    try {
        if (auth.currentUser === null) {
            return {
                toastType: "error",
                message: "Not logged in!"
            }

        }
        let collRef = collection(db, "characters")
        await addDoc(collRef, data);
        return {
            toastType: "success",
            message: "Successfully created character!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }

}

const getCharactersByUserHook = (uid?: string, limitAmount: number = 3) => {
    if (uid === undefined) {
        return [null, true, null]
    }
    let charaRef = collection(db, "characters")
    //if we're doing order by, needs a compound index, created in console. Gonna turn that off for now!
    const q = query(charaRef, limit(limitAmount),where('owner', '==', uid));

    //Debug string... 
    /*let resp = getDocs(q).then((data) => {console.log(data)})*/
    return useCollection(q)
}


const getCharacterHook = (cid?: string) => {
    if (cid === undefined) {
        return [null, true, null]
    }
    let charaRef = doc(db, "characters", cid)
    return useDocument(charaRef)
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