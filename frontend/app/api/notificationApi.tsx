import { handleError, pb } from "./pocketbase"
import { ToastStatus } from "common";
import { getUserInfo } from "./userApi";
import { useQuery } from "@tanstack/react-query";



const parseNotifInfo = (data: NotificationSchema[]) => {


    let returnDict: NotifDict = {
        new_defences: [],
        comments: []
    }

    if (!data) {
        return returnDict
    }

    try {
        data.forEach((notif) => {
            if (notif.expand.attack) {
                notif.attack = notif.expand.attack
                notif.attack!.attackerInfo = notif.attack!.expand.attacker
            }

            if (notif.expand.comment) {
                notif.comment = notif.expand.comment
                notif.comment!.userInfo = notif.comment!.expand.user
            }

            delete notif.expand

            if (notif.notif_type === "reply_attack") {
                returnDict.comments.push(notif)
            } else if (notif.notif_type === "reply_comment") {
                returnDict.comments.push(notif)
            } else if (notif.notif_type === "new_defence") {
                returnDict.new_defences.push(notif)
            }
        })

    } catch (error) {
        console.log(error)
    }

    console.log(returnDict)

    return returnDict

}

const getNotifCount = async () => {

    let uid = pb.authStore.record?.id


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
    Promise<NotifDict | undefined> => {

    let uid = pb.authStore.record?.id

    if (uid === null || uid === undefined) {
        return {
            new_defences: [],
            comments: []
        }
    }


    let notifData = []

    try {
        notifData = await pb.collection('notifications').getList(
            page, limitAmount,

            {
                filter: `notified_user="${uid}"`,
                expand: 'comment, attack, comment.user, attack.attacker',
                sort: '-created',
                requestKey: 'getNotifs'
            }

        ) as any
    } catch (error: unknown) {
        console.log(error)
    }


    return parseNotifInfo(notifData.items)
}


const getNotifsHook = (): [NotifDict | undefined, boolean, Error | null] => {

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