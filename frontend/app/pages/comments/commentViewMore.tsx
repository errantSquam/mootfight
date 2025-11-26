import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router"
import { getCommentByIdHook } from "~/api/commentApi"
import { Comment } from "~/components/comments"

export const ViewMoreCommentPage = () => {
    let params = useParams()
    const [commentData, commentLoading, commentError] = getCommentByIdHook(params.commentId)

    const queryClient = useQueryClient();

    const handleStateRefresh = () => {
        queryClient.refetchQueries({ queryKey: ['singleComment'] })


    }
    return <div>
        {(!commentLoading && commentData) &&
            <Comment commentData={commentData} handleStateRefresh={() => {handleStateRefresh()}}/>
        }
    </div>

}