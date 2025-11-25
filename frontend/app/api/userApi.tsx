
import { ToastStatus } from "common";
import { checkLoggedIn, handleError, pb } from "./pocketbase";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ListResult, RecordModel } from "pocketbase";

const parseUserInfo = (userInfo: UserRecord): UserAmbiguousSchema => {
    let returnInfo = userInfo as UserAmbiguousSchema
    //error logging in case the field doesn't exist for whatever reason (bro forgot to expand)
    try {
        returnInfo.characters = userInfo.expand.characters_via_owner

        returnInfo.attacks = userInfo.expand.attacks_via_attacker

        let defencesArray: AttackSchema[] = []

        returnInfo.characters?.map((character: any) => {
            let images = character.expand.images
            character.images = images


            if (character.expand.attacks_via_characters) {
                let defences = character.expand.attacks_via_characters.filter((defence: AttackSchema) => {
                    return defence !== undefined && defence?.attacker !== userInfo.id
                })
                defencesArray = [...defencesArray, ...defences]
            }

            delete character.expand
            return character
        })

        returnInfo.defences = defencesArray


        delete returnInfo.expand

    } catch (error) {
        console.log(error)
    }

    return returnInfo

}
const getUserInfo = async (user_id?: string) => {

    if (user_id === undefined) {
        await pb.collection('users').authRefresh();

        if (pb.authStore.record !== null) {
            user_id = pb.authStore.record.id
        }
        else {
            return {} as UserAmbiguousSchema
        }
    }

    let userInfo = await pb.collection('users').getOne(user_id, {
        expand: `characters_via_owner, characters_via_owner.images, characters_via_owner.attacks_via_characters, attacks_via_attacker`
    }) as UserRecord


    return parseUserInfo(userInfo)
}

const getUserInfoHook = (user_id?: string): [UserAmbiguousSchema | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo', user_id],
        queryFn: () => {
            return getUserInfo(user_id)
        }
    })

    return [data, isLoading, error]
}

const getUserInfoByUsername = async (username: string | undefined) => {
    if (username === undefined) {
        return undefined
    }
    let userInfo = await pb.collection('users').getFirstListItem(`username="${username}"`, {
        expand: `characters_via_owner, characters_via_owner.images, attacks_via_attacker, characters_via_owner.attacks_via_characters`
    }) as UserRecord
    //note: pocketbase doesn't like backtick newlines



    return parseUserInfo(userInfo)
}

const getUserInfoByUsernameHook = (username: string | undefined):
    [UserAmbiguousSchema | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo', username],
        queryFn: () => {
            return getUserInfoByUsername(username)
        }
    })

    return [data, isLoading, error]
}

const getUsers = async (page: number = 1, limitAmount: number = 3) => {
    let users = await pb.collection("users").getList(page, limitAmount, {
        expand: 'characters_via_owner, characters_via_owner.images, attacks_via_attacker, attacks_via_characters_via_owner'
    }) as any


    users.items = users.items.map((user: UserRecord) => { return parseUserInfo(user) })
    return users
}

const getUsersHook = (page: number = 1, limitAmount: number = 3):
    [ListResult<RecordModel> | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['usersInfo'],
        queryFn: () => {
            return getUsers(page, limitAmount)
        }
    })
    return [data, isLoading, error]


}

const getUsersBySearch = async (substring: string, page: number = 1, limitAmount: number = 3) => {
    let users = await pb.collection("users").getList(page, limitAmount, {
        filter: `username~'${substring}'`,
        //expand: 'characters_via_owner, characters_via_owner.images, attacks_via_attacker, attacks_via_characters_via_owner'
    }) as any


    users.items = users.items.map((user: UserRecord) => { return parseUserInfo(user) })
    return users
}

const usersSearchHook = (searchQuery: string | null = "", page: number = 1, limitAmount: number = 3, enabled : boolean = true):
    [UserSchema[], boolean, Error | null] => {


    if (searchQuery === null) {
        searchQuery = ''
    }

    const { isLoading, error, data } = useQuery({
        queryKey: ['usersSearch', searchQuery],
        queryFn: () => {
            return getUsersBySearch(searchQuery, page, limitAmount)
        },
        enabled: enabled
    })

    return [data?.items, isLoading, error]
}


const updateUserInfo = async (toUpdate: any) => {


    try {
        const isLoggedIn = await checkLoggedIn()
        if (!isLoggedIn) {
            return {
                toast_type: ToastStatus.ERROR,
                message: "Not logged in!"
            }
        }

        const record = await pb.collection('users').update(pb.authStore.record!.id, toUpdate);

        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully updated info!"
        }
    } catch (error) {
        console.log(error)
        return handleError(error)

    }

}

const updateProfilePicture = async (pfp: File) => {

    try {
        const isLoggedIn = await checkLoggedIn()
        if (!isLoggedIn) {
            return {
                toast_type: ToastStatus.ERROR,
                message: "Not logged in!"
            }
        }

        const record = await pb.collection('users').update(pb.authStore.record!.id, { profile_picture: pfp });

        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully updated info!"
        }
    } catch (error) {
        console.log(error)
        return handleError(error)

    }

}
//we should refactor this into different API call files...
export {
    getUserInfo,
    getUserInfoHook,
    getUserInfoByUsernameHook,
    getUsers,
    getUsersHook,
    updateUserInfo,
    updateProfilePicture,
    usersSearchHook
}