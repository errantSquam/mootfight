
import { checkLoggedIn, handleError, pb } from "./pocketbase"
import { ToastStatus } from "common";
const createCharacter = async (data: CharacterSchema) => {
    try {

        let tempData: CharacterRecord = data 
        let imagesData: RefImage[] = data.images 

        const batch = pb.createBatch()

        let imageIds: string[] = []

        imagesData.forEach((image) => {
            let newId = crypto.randomUUID().toString().replaceAll("-", "").substring(0, 15)
            imageIds.push(newId)
            image.id = newId
            image.uploader = pb.authStore.record?.id

            batch.collection('ref_images').create(image)
        })

        /*
        console.log({
            ...tempData,
            images: imageIds
        })*/

        const record = batch.collection('characters').create({
            ...tempData,
            images: imageIds
        })

        const results = await batch.send()



        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully created character!",
            data: record
        }

    } catch (error: unknown) {

        return handleError(error)
    }

}

const getCharactersByUserHook = (user_id?: string, limitAmount: number = 99)
    : [CharacterSchema[] | undefined, boolean, undefined] => {

    /*
if (user_id === undefined) {
    return [undefined, true, undefined]
}
let charaRef = collection(db, "characters")
//if we're doing order by, needs a compound index, created in console. Gonna turn that off for now!
const q = query(charaRef, limit(limitAmount), where('owner', '==', user_id));

let [charaData, charaLoading, charaError] = useCollection(q)


let returnArray: CharacterSchema[] = []
charaData?.forEach((result) => {
    let tempData = result.data()
    tempData.character_id = result.id
    returnArray.push(tempData as CharacterSchema)
})
return [returnArray, charaLoading, charaError]*/
    return [undefined, true, undefined]
}


const getCharacter = async (character_id?: string): Promise<CharacterSchema | undefined> => {
    /*
    if (character_id === undefined) {
        return undefined
    }
    let charaRef = doc(db, "characters", character_id)
    let resp = await getDoc(charaRef)

    return resp.data() as CharacterSchema*/
    return undefined
}

const checkCharacterExists = async (character_id?: string): Promise<boolean> => {
    /*
    const snap = await getCountFromServer(query(
            collection(db, 'characters'), where(documentId(), '==', character_id)
        ))
    
    if (snap.data().count > 0) {
        return true
    } else {
        return false
    }*/
    return false

}

const checkCharactersExist = async (cidArray: string[]): Promise<boolean> => {
    /*
    const snap = await getCountFromServer(query(
            collection(db, 'characters'), where(documentId(), 'in', cidArray)
        ))
    if (snap.data().count === cidArray.length) {
        return true
    } else {
        return false
    }*/
    return false
}

const getCharactersOwners = async (cidArray: string[]): Promise<string[]> => {
    /*
    let resp = await getDocs(query(
            collection(db, 'characters'), where(documentId(), 'in', cidArray)
        ))
    
    let tempArray: string[] = []
    resp.forEach((data) => {
        let owner = data.data().owner
        tempArray.push(owner)
    })

    return tempArray*/
    return []
}

const getCharacterHook = (character_id?: string): [CharacterSchema | undefined, boolean, undefined] => {
    /*
    if (character_id === undefined) {
        return [undefined, true, undefined]
    }
    let charaRef = doc(db, "characters", character_id)
    let [charaData, charaLoading, charaError] = useDocument(charaRef)
    let dataToReturn = charaData?.data() as CharacterSchema
    if (dataToReturn !== undefined) {
        dataToReturn.character_id = charaRef.id
    }
    return [dataToReturn, charaLoading, charaError]*/
    return [undefined, true, undefined]
}




export {
    createCharacter,
    getCharacterHook,
    getCharacter,
    checkCharacterExists,
    checkCharactersExist,
    getCharactersByUserHook,
    getCharactersOwners
}

function isLoggedIn() {
    throw new Error("Function not implemented.");
}
