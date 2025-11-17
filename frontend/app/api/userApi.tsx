import type { FirebaseError } from "firebase/app";
import { app, auth, db, handleError } from "./firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, FirestoreError } from "firebase/firestore";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'
import { ToastStatus } from "common";
const getUserInfo = async (user_id?: string) => {

    /*if (auth.currentUser === null) {
        return null
    }*/
   /*
    if (user_id === undefined) {
        if (auth.currentUser !== null) {
            user_id = auth.currentUser.user_id
        }
        else {
            return {}
        }
    }
    let docRef = doc(db, "users", user_id)
    let docSnap = await getDoc(docRef)
    return docSnap.data()*/
    return {}
}

const getUserInfoHook = (user_id?: string): [UserAmbiguousSchema| undefined, boolean, FirestoreError | undefined] => {
    return [undefined, true, undefined]
    /*

    if (user_id === null) {
        let [undefinedInfo, returnedLoading, returnedError] = useDocument(undefined) //oops all undefined
        return [undefined, returnedLoading, returnedError]
    }
    if (user_id === undefined) {
        if (auth.currentUser !== null) {
            user_id = auth.currentUser.user_id
        }
        else {
            //this shouldn't be called...
            console.log("This shouldn't be called...")
            user_id = 'invalid'
        }
    }

    let [unhandledInfo, returnedLoading, returnedError] = useDocument(doc(db, 'users', user_id))
    let returnedInfo = unhandledInfo?.data() as UserAmbiguousSchema
    return [returnedInfo, returnedLoading, returnedError]*/
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

const getUserInfoByUsernameHook = (username: string | undefined):
 [UserSchema[], boolean, FirebaseError | undefined] => {
    if (username === undefined) {
        return [[] as UserSchema[], true, undefined]
    }

    let usersRef = collection(db, "users")
    const q = query(usersRef, orderBy("username"), where('username', '==', username));
    let [userData, userLoading, userError] = useCollection(q)

    let returnedArray: UserSchema[] = []

    userData?.docs.forEach((document) => {
        returnedArray.push((document.data() as UserSchema))
    })

    return [returnedArray, userLoading, userError]
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
    return {
            toastType: ToastStatus.SUCCESS,
            message: "Successfully updated info!"
        }
    /*
    if (auth.currentUser === null) {
        return {
            toastType: ToastStatus.ERROR,
            message: "Not logged in!"
        }
    }

    let docRef = doc(db, "users", auth.currentUser.user_id)
    let docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        updateDoc(docRef, toUpdate);
        //Catch errors here...

        return {
            toastType: ToastStatus.SUCCESS,
            message: "Successfully updated info!"
        }
    }
    else {
        return {
            toastType: ToastStatus.ERROR,
            message: "User does not exist."
        }

    }*/

}

//we should refactor this into different API call files...
export {
    getUserInfo,
    getUserInfoHook,
    getUserInfoByUsernameHook,
    getUsers,
    getUsersHook,
    updateUserInfo
}