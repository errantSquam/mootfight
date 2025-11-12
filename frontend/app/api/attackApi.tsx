import type { FirebaseError } from "firebase/app";
import { app, auth, db, handleError } from "./firebase"
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, FirestoreError } from "firebase/firestore";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'
import { ToastStatus } from "common";


const createAttack = async (data: AttackSchema) => {
    try {
        if (auth.currentUser === null) {
            return {
                toastType: ToastStatus.ERROR,
                message: "Not logged in!"
            }

        }
        let collRef = collection(db, "attacks")
        let resp = await addDoc(collRef, data);
        return {
            toastType: ToastStatus.SUCCESS,
            message: "Successfully created attack!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }

}




export {
    createAttack
}