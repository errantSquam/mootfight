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
        //TODO: Batch update with notifications to the defenders as well
        return {
            toastType: ToastStatus.SUCCESS,
            message: "Successfully created attack!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }

}

const getAttack = async (aid?: string): Promise<AttackSchema | undefined> => {
    if (aid === undefined) {
        return undefined
    }
    let attackRef = doc(db, "attacks", aid)
    let resp = await getDoc(attackRef)

    return resp.data() as AttackSchema
}

const getAttackHook = (aid?: string): [AttackSchema | undefined, boolean, FirestoreError | undefined] => {
    if (aid === undefined) {
        return [undefined, true, undefined]
    }
    let attackRef = doc(db, "attacks", aid)
    let [attackData, attackLoading, attackError] = useDocument(attackRef)
    let dataToReturn = attackData?.data() as AttackSchema
    if (dataToReturn !== undefined) {
        dataToReturn.aid = attackRef.id
    }
    return [dataToReturn, attackLoading, attackError]
}



const getAttacksByUserHook = (uid?: string, limitAmount: number = 4, pagination:number = 1)
    : [AttackSchema[] | undefined, boolean, FirestoreError | undefined] => {
    if (uid === undefined) {
        return [undefined, true, undefined]
    }
    let attackRef = collection(db, "attacks")
    //if we're doing order by, needs a compound index, created in console. 
    const q = query(attackRef, limit(limitAmount), orderBy("creationDate", "desc"), where('attacker', '==', uid));

    //Debug string... Or we could call the error that's, you know, returned by useCollection but shh it's okay.
    //let resp = getDocs(q).then((data) => {console.log(data)})

    let [charaData, charaLoading, charaError] = useCollection(q)


    let returnArray: AttackSchema[] = []
    charaData?.forEach((result) => {
        let tempData = result.data()
        tempData.aid = result.id
        returnArray.push(tempData as AttackSchema)
    })
    return [returnArray, charaLoading, charaError]
}


const getDefencesByUserHook = (uid?: string, limitAmount: number = 4, pagination:number = 1)
    : [AttackSchema[] | undefined, boolean, FirestoreError | undefined] => {
    if (uid === undefined) {
        return [undefined, true, undefined]
    }
    let attackRef = collection(db, "attacks")
    //if we're doing order by, needs a compound index, created in console.
    const q = query(attackRef, limit(limitAmount), orderBy("creationDate", "desc"), 
    where("defenders", "array-contains", uid));

    //Debug string... Or we could call the error that's, you know, returned by useCollection but shh it's okay.
    let resp = getDocs(q).then((data) => {console.log(data)})

    let [charaData, charaLoading, charaError] = useCollection(q)


    let returnArray: AttackSchema[] = []
    charaData?.forEach((result) => {
        let tempData = result.data()
        tempData.aid = result.id
        returnArray.push(tempData as AttackSchema)
    })
    return [returnArray, charaLoading, charaError]
}

export {
    createAttack,
    getAttack,
    getAttackHook,
    getAttacksByUserHook,
    getDefencesByUserHook
}