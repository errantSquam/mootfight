
import { useRef, useState } from "react"
import { SanitizedMarkdown } from "~/components/profile/sanitizedMarkdown"
import { getPfp } from "~/functions/helper"
import { getProfileLink } from "~/functions/helper"
import { Link } from "react-router"
import { MarkdownEditor } from "~/components/markdownEditor"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { Icon } from "@iconify/react"
import { pb } from "~/api/pocketbase"
import { createComment } from "~/api/commentApi"
import { handleToast } from "~/functions/handleToast"


export const handleCommentSubmit = async (attack_id?: string, markdown?: string, reply_to?: string) => {

    if (markdown === '' || markdown === undefined || (attack_id === undefined && reply_to === undefined)) {
        return
    }

    let commentData = {
        user: pb.authStore.record?.id,
        content: markdown,
        attack: attack_id

    } as CommentSchema

    if (reply_to !== undefined) {
        commentData.reply_to = reply_to
    }
    let resp = await createComment(commentData)
    handleToast(resp)

    return resp.toast_type

}


export const Comment = ({ commentData, handleStateRefresh = () => {}, depth = 0, maxDepth = 2 }:
    { commentData: CommentSchema, handleStateRefresh?: any, depth?: number, maxDepth?: number }) => {


    const repliesRef = useRef<MDXEditorMethods>(null)
    const [isReplying, setIsReplying] = useState(false)

    let userInfo = commentData.expand?.user
    return <div className="flex flex-col items-start max-w-full gap-y-2 mt-2">
        <Link to={getProfileLink(userInfo?.username)} className="flex flex-row gap-x-2 items-center">
            <img src={getPfp(userInfo?.id, userInfo?.profile_picture)} className="w-10 h-10" />
            <div className="flex flex-col gap-x-1">
                <div className="font-bold">{userInfo?.username}</div>
                {userInfo?.pronouns !== '' && <div className="text-zinc-400 italic">({userInfo?.pronouns})</div>}
            </div>
        </Link>
        <div className="ml-5 p-2 w-full border-zinc-700 border-2  rounded">
            <SanitizedMarkdown markdown={commentData.content} />
        </div>
        <div className="ml-7 text-sm flex flex-row gap-x-2">
            <div className="flex flex-row items-center gap-x-1 text-zinc-300 hover:text-white cursor-pointer"
                onClick={() => { setIsReplying(true) }}>
                <Icon icon="material-symbols:reply" />
                <span>Reply</span>
            </div>

            {/*If comment's user = current authstore id*/}
            {
                pb.authStore.record?.id === userInfo?.id &&
                <div className="text-zinc-300 hover:text-white cursor-pointer">
                    Edit
                </div>
            }

            {
                pb.authStore.record?.id === userInfo?.id &&
                <div className="text-zinc-300 hover:text-white cursor-pointer">
                    Delete
                </div>
            }
        </div>

        {
            isReplying &&
            <form className="ml-10 w-full flex flex-col gap-y-2">
                <MarkdownEditor ref={repliesRef} />
                <div className="flex flex-row gap-x-2 px-2">
                    <input type="submit" value="Submit"
                        className="w-full bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded"
                        onClick={(e) => {
                            e.preventDefault()
                            handleCommentSubmit(undefined, repliesRef.current?.getMarkdown(), commentData.id).then((resp) => {
                                if (resp === "success") {
                                    setIsReplying(false)
                                    repliesRef.current?.setMarkdown('')
                                    handleStateRefresh()
                                }
                            })
                        }} />
                    <div className={`w-full bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded
                    flex text-center items-center justify-center`}
                        onClick={() => { setIsReplying(false) }}>
                        Cancel
                    </div>
                </div>
            </form>
        }


        <div className="ml-10 w-full">
            {depth < maxDepth ? commentData?.expand.comments_via_reply_to?.map((reply: CommentSchema) => {
                return <Comment commentData={reply}
                    handleStateRefresh={handleStateRefresh}
                    depth={depth + 1} />
            })
                :
                <Link to = {`/comment/${commentData.id}`} 
                className = "cursor-pointer italic underline text-zinc-400 hover:text-white">
                    Read more...
                </Link>
            }
        </div>

    </div>
}
