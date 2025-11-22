
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
        delete returnInfo.expand
        returnInfo.characters?.map((character: any) => {

            let images = character.expand.images
            character.images = images
            delete character.expand
            return character
        })
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
        expand: 'characters_via_owner, characters_via_owner.images, attacks_via_attacker, attacks_via_characters_via_owner'
    }) as UserRecord


    return parseUserInfo(userInfo)
}

const getUserInfoHook = (user_id?: string): [UserAmbiguousSchema | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo'],
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
    let userInfo = await pb.collection('posts').getFirstListItem(`username="${username}"`, {
        expand: 'characters_via_owner, characters_via_owner.images, attacks_via_attacker, attacks_via_characters_via_owner'
    }) as UserRecord

    return parseUserInfo(userInfo)
}

const getUserInfoByUsernameHook = (username: string | undefined):
    [UserAmbiguousSchema | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo'],
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


const usersSearchHook = (searchQuery: string | null = "", limitAmount: number = 3, pagination = 0):
    [UserSchema[], boolean, undefined] => {
    return [[] as UserSchema[], true, undefined]
    /*
    if (searchQuery === null || searchQuery === '') {
        return [[] as UserSchema[], true, undefined]
    }
    let usersRef = collection(db, "users")
    //placeholder because firebase fucking SUCKS and doesn't have a contains operation what the HELL
    const q = query(usersRef, orderBy("username"), limit(limitAmount), where('username', '==', searchQuery));
    let [userData, userLoading, userError] = useCollection(q)

    let returnedArray: UserSchema[] = []

    userData?.docs.forEach((document) => {
        returnedArray.push((document.data() as UserSchema))
    })

    return [returnedArray, userLoading, userError]*/
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

//we should refactor this into different API call files...
export {
    getUserInfo,
    getUserInfoHook,
    getUserInfoByUsernameHook,
    getUsers,
    getUsersHook,
    updateUserInfo,
    usersSearchHook
}