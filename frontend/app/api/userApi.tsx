
import { ToastStatus } from "common";
import { pb } from "./pocketbase";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { ListResult, RecordModel } from "pocketbase";
const getUserInfo = async (user_id?: string) => {

    if (user_id === undefined) {
        await pb.collection('users').authRefresh();

        if (pb.authStore.record !== null) {
            user_id = pb.authStore.record.id
        }
        else {
            return {} as UserRecord
        }
    }

    let userInfo = await pb.collection('users').getOne(user_id, {
        expand: 'characters_via_owner, attacks_via_attacker, attacks_via_characters_via_owner'
    }) as UserRecord
    return userInfo
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
        expand: 'characters_via_owner, attacks_via_attacker, attacks_via_characters_via_owner'
    }) as UserRecord

    return userInfo
}

const getUserInfoByUsernameHook = (username: string | undefined):
    [UserRecord | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo'],
        queryFn: () => {
            return getUserInfoByUsername(username)
        }
    })

    return [data, isLoading, error]
}

const getUsers = async (page: number = 1, limitAmount: number = 3) => {
    let users = await pb.collection("users").getList(page, limitAmount)
    return users
}

const getUsersHook = (page: number = 1, limitAmount: number = 3):
[ListResult<RecordModel> | undefined, boolean, Error|null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['userInfo'],
        queryFn: () => {
            return getUsers(page, limitAmount)
        },
        placeholderData: {items: []} as any
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


    await pb.collection('users').authRefresh();

    if (pb.authStore.record === null) {
        return {
            toast_type: ToastStatus.ERROR,
            message: "Not logged in!"
        }
    }

    const record = await pb.collection('users').update(pb.authStore.record.id, toUpdate);

    if (record.status !== undefined) {

        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully updated info!"
        }
    }
    else {
        console.log(record)
        return {
            toast_type: ToastStatus.ERROR,
            message: record.message
        }

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