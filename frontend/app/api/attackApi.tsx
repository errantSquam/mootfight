import type { FirebaseError } from "firebase/app";
import { handleError, supabase } from "./supabase"
import { collection, doc, setDoc, addDoc, getDoc, getDocs, updateDoc, FirestoreError, startAt } from "firebase/firestore";
import { getCountFromServer, query, orderBy, limit, documentId, where } from "firebase/firestore";
import { useDocument, useCollection } from 'react-firebase-hooks/firestore'
import { ToastStatus } from "common";


const createAttack = async (data: AttackSchema) => {
    try {
        if (!supabase.auth.getSession()) {
            return {
                toast_type: ToastStatus.ERROR,
                message: "Not logged in!"
            }

        }
        /*
        let collRef = collection(db, "attacks")
        let resp = await addDoc(collRef, data);*/
        //TODO: Batch update with notifications to the defenders as well
        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully created attack!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }

}

const getAttack = async (aid?: string): Promise<AttackSchema | undefined> => {
    /*
    if (aid === undefined) {
        return undefined
    }
    let attackRef = doc(db, "attacks", aid)
    let resp = await getDoc(attackRef)

    return resp.data() as AttackSchema*/
    return undefined
}

const getAttackHook = (aid?: string): [AttackSchema | undefined, boolean, FirestoreError | undefined] => {
    return [undefined, true, undefined]
    /*
    if (aid === undefined) {
        return [undefined, true, undefined]
    }
    let attackRef = doc(db, "attacks", aid)
    let [attackData, attackLoading, attackError] = useDocument(attackRef)
    let dataToReturn = attackData?.data() as AttackSchema
    if (dataToReturn !== undefined) {
        dataToReturn.attack_id = attackRef.id
    }
    return [dataToReturn, attackLoading, attackError]*/
}



const getAttacksByUserHook = (user_id?: string, limitAmount: number = 4, pagination:number = 0)
    : [AttackSchema[] | undefined, boolean, FirestoreError | undefined] => {
    return [undefined, true, undefined]
    /*
    if (user_id === undefined) {
        return [undefined, true, undefined]
    }
    let attackRef = collection(db, "attacks")
    //if we're doing order by, needs a compound index, created in console. 
    const q = query(attackRef, limit(limitAmount), orderBy("creationDate", "desc"), where('attacker', '==', user_id));

    //Debug string... Or we could call the error that's, you know, returned by useCollection but shh it's okay.
    //let resp = getDocs(q).then((data) => {console.log(data)})

    let [attackData, attackLoading, attackError] = useCollection(q)


    let returnArray: AttackSchema[] = []
    attackData?.forEach((result) => {
        let tempData = result.data()
        tempData.aid = result.id
        returnArray.push(tempData as AttackSchema)
    })
    return [returnArray, attackLoading, attackError]*/
}


const getDefencesByUserHook = (user_id?: string, limitAmount: number = 4, pagination:number = 0)
    : [AttackSchema[] | undefined, boolean, FirestoreError | undefined] => {
        return [undefined, true, undefined]
    /*
    if (user_id === undefined) {
        return [undefined, true, undefined]
    }
    let attackRef = collection(db, "attacks")
    //if we're doing order by, needs a compound index, created in console.
    const q = query(attackRef, limit(limitAmount), orderBy("creationDate", "desc"), 
    where("defenders", "array-contains", user_id));

    //Debug string... Or we could call the error that's, you know, returned by useCollection but shh it's okay.
    //let resp = getDocs(q).then((data) => {console.log(data)})

    let [attackData, attackLoading, attackError] = useCollection(q)


    let returnArray: AttackSchema[] = []
    attackData?.forEach((result) => {
        let tempData = result.data()
        tempData.aid = result.id
        returnArray.push(tempData as AttackSchema)
    })
    return [returnArray, attackLoading, attackError]*/
}

const getDefencesByCharacterHook = (character_id?: string, limitAmount: number = 4, pagination:number = 0)
    : [AttackSchema[] | undefined, boolean, FirestoreError | undefined] => {
        return [undefined, true, undefined]
        /*
    if (character_id === undefined) {
        return [undefined, true, undefined]
    }

    console.log("character_id:" + character_id)
    let attackRef = collection(db, "attacks")
    //if we're doing order by, needs a compound index, created in console.
    const q = query(attackRef, limit(limitAmount), orderBy("creationDate", "desc"), 
    where("characters", "array-contains", character_id));

    //Debug string... Or we could call the error that's, you know, returned by useCollection but shh it's okay.
    console.log("Resp")
    let resp = getDocs(q).then((data) => {data?.forEach((result) => {
        console.log(result)
    })})

    let [attackData, attackLoading, attackError] = useCollection(q)


    let returnArray: AttackSchema[] = []
    attackData?.forEach((result) => {
        let tempData = result.data()
        tempData.aid = result.id
        returnArray.push(tempData as AttackSchema)
    })
    return [returnArray, attackLoading, attackError]*/
}

export {
    createAttack,
    getAttack,
    getAttackHook,
    getAttacksByUserHook,
    getDefencesByUserHook,
    getDefencesByCharacterHook
}