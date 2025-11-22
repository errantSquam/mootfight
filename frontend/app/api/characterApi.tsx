
import { useQuery } from "@tanstack/react-query";
import { checkLoggedIn, handleError, pb } from "./pocketbase"
import { ToastStatus } from "common";


const parseCharacterInfo = (characterInfo: CharacterSchema): CharacterSchema => {
    let returnInfo = characterInfo as CharacterAmbiguousSchema

    //error logging in case the field doesn't exist for whatever reason (bro forgot to expand)
    try {
        let images = returnInfo.expand.images
        returnInfo.images = images

        let owner = returnInfo.expand.owner
        returnInfo.owner = owner
        
        delete returnInfo.expand
        return returnInfo

    } catch (error) {
        console.log(error)
    }

    return returnInfo

}
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

    //is this needed anymore?

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

    if (character_id === undefined) {
        return undefined
    }

    let charaInfo = await pb.collection('characters').getOne(character_id, {
        expand: 'owner, images, attacks_via_characters_via_owner'
    }) as CharacterSchema

    return parseCharacterInfo(charaInfo)
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

const getCharacterHook = (character_id?: string): [CharacterSchema | undefined, boolean, Error | null] => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['characterInfo'],
        queryFn: () => {
            return getCharacter(character_id)
        }
    })

    return [data, isLoading, error]

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
