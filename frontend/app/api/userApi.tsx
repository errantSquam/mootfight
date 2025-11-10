import { app, auth, db, handleError } from "./firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'

const getUserInfo = async (uid?: string) => {

    /*if (auth.currentUser === null) {
        return null
    }*/
    if (uid === undefined) {
        if (auth.currentUser !== null) {
            uid = auth.currentUser.uid
        }
        else {
            return {}
        }
    }
    let docRef = doc(db, "users", uid)
    let docSnap = await getDoc(docRef)
    return docSnap.data()
}

const getUserInfoHook = (uid?: string) => {
    if (uid === undefined) {
        if (auth.currentUser !== null) {
            uid = auth.currentUser.uid
        }
        else {
            uid = ''
        }
    }

    return useDocument(doc(db, 'users', uid))

}

const getUserInfoByUsername = async (username: string | undefined) => {
    if (username === undefined) {
        return [undefined, true, undefined]
    }
    let usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("username"), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot

}

const getUserInfoByUsernameHook = (username: string | undefined) => {
    if (username === undefined) {
        return [undefined, true, undefined]
    }
    let usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("username"), where('username', '==', username));
    return useCollection(q)
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
    return useCollection(q)
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

//we should refactor this into different API call files...
export {
    app,
    auth,
    db,
    getUserInfo,
    getUserInfoHook,
    getUserInfoByUsernameHook,
    getUsers,
    getUsersHook,
    updateUserInfo
}