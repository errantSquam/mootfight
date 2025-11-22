
import { useQuery } from "@tanstack/react-query";
import { checkLoggedIn, handleError, pb } from "./pocketbase"
import { ToastStatus } from "common";


const parseCharacterInfo = (characterInfo: CharacterSchema): CharacterSchema => {
    let returnInfo = characterInfo as CharacterAmbiguousSchema
    //console.log(returnInfo.expand)

    //error logging in case the field doesn't exist for whatever reason (bro forgot to expand)
    try {
        let images = returnInfo.expand.images
        returnInfo.images = images

        let owner = returnInfo.expand.owner
        returnInfo.owner = owner

        let attacks = returnInfo.expand.attacks_via_characters
        returnInfo.attacks = attacks

        delete returnInfo.expand
        return returnInfo

    } catch (error) {
        console.log(error)
    }

    return returnInfo

}
const createCharacter = async (data: CharacterSchema) => {
    try {

        let tempData: CharacterRecord = data as CharacterRecord
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
            data: results
        }

    } catch (error: unknown) {

        return {...handleError(error), data: {}}
    }

}

const getCharacter = async (character_id?: string): Promise<CharacterSchema | undefined> => {

    if (character_id === undefined) {
        return undefined
    }

    let charaInfo = await pb.collection('characters').getOne(character_id, {
        expand: 'owner, images, attacks_via_characters'
    }) as CharacterSchema

    return parseCharacterInfo(charaInfo)
}

const checkCharacterExists = async (character_id?: string): Promise<boolean> => {
    try {
        await getCharacter(character_id)
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}

const checkCharactersExist = async (cidArray: string[]): Promise<boolean> => {
    const resultList = await pb.collection('characters').getList(1, cidArray.length);

    if (resultList.totalItems === cidArray.length) {
        return true
    }
    return false
}

const getCharactersOwners = async (cidArray: string[]): Promise<string[]> => {

    const resultList = await pb.collection('characters').getList(1, cidArray.length, {
        expand: 'owner, images, characters_via_owner.attacks_via_character'
    });

    return resultList.items.map((chara) => {return chara.owner.id})
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
    getCharactersOwners
}

