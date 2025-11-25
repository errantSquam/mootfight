import { handleError, pb } from "./pocketbase"
import { ToastStatus } from "common";
import { getUserInfo } from "./userApi";
import { useQuery } from "@tanstack/react-query";


const parseNotifInfo = (data: any) => {
    let returnInfo = data
    console.log(returnInfo)
    //console.log(returnInfo.expand)

    //error logging in case the field doesn't exist for whatever reason (bro forgot to expand)
    try {

    } catch (error) {
        console.log(error)
    }

    console.log(returnInfo)

    return returnInfo

}

const getNotifCount = async () => {

    let uid = pb.authStore.record?.id

    console.log(uid)


    let notifCount = 0
    if (uid === null || uid === undefined) {
        return notifCount
    }

    try {
        let notifData = await pb.collection('notifications').getList(
            1, 1,
            {
                filter: `notified_user="${uid}"`,
            }

        ) as any

        notifCount = notifData.totalItems
    } catch (error: unknown) {
        console.log(error)
    }

    return notifCount
}

const getNotifs = async (page: number = 1, limitAmount: number = 99):
    Promise<CommentSchema[] | undefined> => {

    let uid = pb.authStore.record?.id

    if (uid === null || uid === undefined) {
        return []
    }


    let notifData = []
    try {
        notifData = await pb.collection('notifications').getList(
            page, limitAmount,

            {
                filter: `notified_user="${uid}"`,
                expand: 'comment, attack',
                sort: '-created'
            }

        ) as any
    } catch (error: unknown) {
        console.log(error)
    }

    return notifData.items.map((notif: any) => { return parseNotifInfo(notif) })
}


const getNotifsHook = (): [any[] | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['notificationsFull'],
        queryFn: () => {
            return getNotifs()
        }
    })

    return [data, isLoading, error]
}

const getNotifCountHook = (): [number | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['notificationCount'],
        queryFn: () => {
            return getNotifCount()
        }
    })

    return [data, isLoading, error]
}


export {
    getNotifsHook,
    getNotifCountHook
}