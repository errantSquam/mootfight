import { getAttackHook } from "~/api/attackApi"
import { useNavigate, useParams } from "react-router"
import { useRef, useState } from "react"
import { SanitizedMarkdown } from "~/components/profile/sanitizedMarkdown"
import { getUserInfoHook } from "~/api/userApi"
import { getPfp } from "~/functions/helper"
import { getProfileLink } from "~/functions/helper"
import { Link } from "react-router"
import { MarkdownEditor } from "~/components/markdownEditor"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { Icon } from "@iconify/react"
import { pb } from "~/api/pocketbase"
import { createComment, getCommentsFromAttackHook } from "~/api/commentApi"
import { handleToast } from "~/functions/handleToast"
import { useQueryClient } from "@tanstack/react-query"
import { Comment, handleCommentSubmit } from "~/components/comments"
/*
quick ref
type CommentSchema = {
    id?: string
    user: string,
    content:string,
    reply_to?: string, //comment id
    attack?: string,
    profile?: string,
    created: number,
    updated: number,
    replies?: [],
    expand?: any

}
*/
//Refactor this outta there later

export default function AttackPage() {
    let params = useParams()
    const commentsRef = useRef<MDXEditorMethods>(null)


    const [attackData, attackLoading, attackError] = getAttackHook(params.attackId)
    const [userData, userLoading, userError] = getUserInfoHook(attackData?.attacker || undefined)

    const [commentData, commentLoading, commentError] = getCommentsFromAttackHook(params.attackId)


    const [enlarge, setEnlarge] = useState(false)

    const queryClient = useQueryClient();

    const handleStateRefresh = () => {
        queryClient.resetQueries({ queryKey: ['attackComments'] })


    }



    return <div className="flex flex-col items-center pb-10">
        <div className={`flex ${enlarge ? "flex-col" : "flex-row"} gap-y-2 ${enlarge ? "items-center" : "items-start"} w-2/3`}>
            <div className="flex flex-col gap-y-2 items-center">
                <h1> {attackData?.title}</h1>
                <div className="italic text-zinc-400">{new Date(attackData?.created || 0).toString()}</div>

                <img src={attackData?.image_link} className={`${enlarge ? "w-full" : "w-2/3"} cursor-pointer`}
                    onClick={() => { setEnlarge(!enlarge) }}
                />
                <div className="italic text-zinc-400">(Click to enlarge; click again to shrink)</div>
                <div className="flex flex-col items-start w-full gap-y-2 mt-2">
                    <Link to={getProfileLink(userData?.username || '')} className="flex flex-row gap-x-2">
                        <img src={getPfp(userData?.id, userData?.profile_picture)} className="w-15" />
                        <div className="flex flex-col gap-x-1">
                            <div className="font-bold">{userData?.username}</div>
                            {userData?.pronouns && <div className="text-zinc-400 italic">({userData?.pronouns})</div>}
                        </div>
                    </Link>
                    <div className="ml-5 p-2 border-zinc-700 border-2 w-full rounded">
                        <SanitizedMarkdown markdown={attackData?.description || '*This attack has no description.*'} />
                    </div>
                </div>
            </div>
            <div className={`flex flex-col items-start justify-start ${enlarge ? "w-full h-auto mt-0"
                : "w-1/2 h-full mt-10"} 
            gap-y-2`}>
                <h3> Comments </h3>
                <div className="ml-10 flex flex-col gap-y-2 w-full">

                    {
                        pb.authStore.isValid &&
                        <div className="w-full mb-10">
                            <form className="flex flex-col gap-y-2">
                                <MarkdownEditor ref={commentsRef} />
                                <input type="submit" value="Submit"
                                    className="w-full bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        handleCommentSubmit(attackData?.id, commentsRef.current?.getMarkdown()).then((resp) => {
                                            if (resp === "success") {
                                                handleStateRefresh()
                                                commentsRef.current?.setMarkdown('')
                                            }
                                        })
                                    }}
                                />
                            </form>
                        </div>
                    }

                    {
                        commentLoading &&
                        <i> Loading comments...</i>
                    }

                    {
                        !commentLoading && commentData?.length === 0 &&
                        <i>This attack has no comments.</i>
                    }

                    {
                        !commentLoading && commentData?.map((comment) => {
                            console.log(comment)
                            return <Comment commentData={comment}
                                handleStateRefresh={handleStateRefresh} />
                        })
                    }

                </div>
            </div>

        </div>
    </div>
}