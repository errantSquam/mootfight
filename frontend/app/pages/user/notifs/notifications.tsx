import { Link } from "react-router"
import { getNotifsHook } from "~/api/notificationApi"
import { ImageWithLoader } from "~/components/loaders"
import { Comment } from "~/pages/attack/attackView"

export const NotificationsPage = () => {
    const [notifData, notifLoading, notifError] = getNotifsHook()



    const CommentNotif = ({ notifData }: { notifData: NotificationSchema }) => {
        if (notifData.notif_type === "reply_comment") {
            return <div className="flex flex-col gap-y-1">
                <div>{notifData.comment?.userInfo.username} replied to your comment.</div>
                <Comment commentData={notifData.comment!} />


            </div>
        } else if (notifData.notif_type === "reply_attack") {
            return <div className="flex flex-col gap-y-1">
                <div>{notifData.comment?.userInfo.username} replied to your attack.</div>
                <Comment commentData={notifData.comment!} />


            </div>
        }

        return <div />
    }

    const DefenceNotif = ({ notifData }: { notifData: NotificationSchema }) => {

        return <div className="flex flex-row gap-x-2 border-2 rounded border-zinc-600 p-4">
            <div className="flex flex-col">
                <Link to={`/attack/${notifData.attack!.id}`} className="flex flex-col items-center">
                    <ImageWithLoader src={notifData.attack!.image_link} className="w-50 h-50 object-cover"
                        spoiler={notifData.attack?.warnings} />
                    <div className="w-40 text-center text-ellipsis overflow-hidden font-bold">{notifData.attack!.title}</div>
                    <div className="w-40 text-center text-ellipsis overflow-hidden">from {
                    notifData.attack!.attackerInfo.username 
                    }</div>

                </Link>
            </div>
        </div>
    }
    return <div className="px-20 py-5 flex flex-col gap-y-4">
        <h1>Notifications</h1>
        {!notifLoading &&
            <div className="flex flex-col gap-y-4 ml-2">
                {notifData!.new_defences.length !== 0 &&
                    <div className="">
                        <h3> New Defences</h3>
                        <div className="flex flex-row gap-x-4 py-4 px-4 ">
                            {notifData!.new_defences.map((notif) => {
                                return <DefenceNotif notifData={notif} />

                            })}
                        </div>
                    </div>
                }
                {
                    notifData!.comments.length !== 0 &&
                    <div className="flex flex-col gap-y-2">
                        <h3>Comments</h3>
                        <div className="flex flex-col ml-2 gap-y-2">
                            {notifData!.comments.map((notif) => {
                                return <div className="py-1 px-4 border-2 rounded border-zinc-500">
                                    <CommentNotif notifData={notif} />
                                </div>
                            }

                            )}
                        </div>

                    </div>
                }
            </div>
        }
    </div>


}