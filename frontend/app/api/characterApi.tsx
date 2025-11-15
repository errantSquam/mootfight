import type { FirebaseError } from "firebase/app";
import { app, auth, db, handleError } from "./firebase"
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, FirestoreError } from "firebase/firestore";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'
import { ToastStatus } from "common";
const createCharacter = async (data: CharacterSchema) => {
    try {
        if (auth.currentUser === null) {
            return {
                toastType: ToastStatus.ERROR,
                message: "Not logged in!"
            }

        }
        let collRef = collection(db, "characters")
        let resp = await addDoc(collRef, data);
        return {
            toastType: ToastStatus.SUCCESS,
            message: "Successfully created character!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }

}

const getCharactersByUserHook = (uid?: string, limitAmount: number = 99)
    : [CharacterSchema[] | undefined, boolean, FirestoreError | undefined] => {
    if (uid === undefined) {
        return [undefined, true, undefined]
    }
    let charaRef = collection(db, "characters")
    //if we're doing order by, needs a compound index, created in console. Gonna turn that off for now!
    const q = query(charaRef, limit(limitAmount), where('owner', '==', uid));

    //Debug string... Or we could call the error that's, you know, returned by useCollection but shh it's okay.
    /*let resp = getDocs(q).then((data) => {console.log(data)})*/

    let [charaData, charaLoading, charaError] = useCollection(q)


    let returnArray: CharacterSchema[] = []
    charaData?.forEach((result) => {
        let tempData = result.data()
        tempData.cid = result.id
        returnArray.push(tempData as CharacterSchema)
    })
    return [returnArray, charaLoading, charaError]
}


const getCharacter = async (cid?: string): Promise<CharacterSchema | undefined> => {
    if (cid === undefined) {
        return undefined
    }
    let charaRef = doc(db, "characters", cid)
    let resp = await getDoc(charaRef)

    return resp.data() as CharacterSchema
}

const checkCharacterExists = async (cid?: string): Promise<boolean> => {
    const snap = await getCountFromServer(query(
            collection(db, 'characters'), where(documentId(), '==', cid)
        ))
    
    if (snap.data().count > 0) {
        return true
    } else {
        return false
    }

}

const checkCharactersExist = async (cidArray: string[]): Promise<boolean> => {
    const snap = await getCountFromServer(query(
            collection(db, 'characters'), where(documentId(), 'in', cidArray)
        ))
    if (snap.data().count === cidArray.length) {
        return true
    } else {
        return false
    }
}

const getCharactersOwners = async (cidArray: string[]): Promise<string[]> => {
    let resp = await getDocs(query(
            collection(db, 'characters'), where(documentId(), 'in', cidArray)
        ))
    
    let tempArray: string[] = []
    resp.forEach((data) => {
        let owner = data.data().owner
        tempArray.push(owner)
    })

    return tempArray
}

const getCharacterHook = (cid?: string): [CharacterSchema | undefined, boolean, FirestoreError | undefined] => {
    if (cid === undefined) {
        return [undefined, true, undefined]
    }
    let charaRef = doc(db, "characters", cid)
    let [charaData, charaLoading, charaError] = useDocument(charaRef)
    let dataToReturn = charaData?.data() as CharacterSchema
    if (dataToReturn !== undefined) {
        dataToReturn.cid = charaRef.id
    }
    return [dataToReturn, charaLoading, charaError]
}




//we should refactor this into different API call files...
export {
    createCharacter,
    getCharacterHook,
    getCharacter,
    checkCharacterExists,
    checkCharactersExist,
    getCharactersByUserHook,
    getCharactersOwners
}