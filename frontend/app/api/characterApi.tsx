import { app, auth, db, handleError } from "./firebase"
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'


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


//we should refactor this into different API call files...
export {
    createCharacter,
    getCharacterHook,
    getCharactersByUserHook,
}