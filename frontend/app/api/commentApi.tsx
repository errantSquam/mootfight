import { handleError, pb } from "./pocketbase"
import { ToastStatus } from "common";
import { getUserInfo } from "./userApi";
import { useQuery } from "@tanstack/react-query";


const parseCommentInfo = (data: CommentSchema) => {
    let returnInfo = data as CommentSchema
    console.log(returnInfo)
    //console.log(returnInfo.expand)

    //error logging in case the field doesn't exist for whatever reason (bro forgot to expand)
    try {
        //may have to scrap this for comments bc the recursive replies are a bit...

        /*
        if (returnInfo.expand.comments_via_reply_to) {
            let replies = returnInfo.expand.comments_via_reply_to
            returnInfo.replies = replies
        }

        
        let user = returnInfo.expand.user
        returnInfo.userInfo = user 
        

        delete returnInfo.expand
        return returnInfo*/

    } catch (error) {
        console.log(error)
    }

    console.log(returnInfo)

    return returnInfo

}

const createComment = async (data: CommentSchema) => {
    try {
        //TODO: Batch update with notifications to the defenders as well? Or perhaps a Hook.

        pb.collection('comments').create(data)
        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully posted comment!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }
}

const getCommentsFromAttack = async (aid?: string, page: number = 1, limitAmount: number = 99):
    Promise<CommentSchema[] | undefined> => {

    if (aid === undefined) {
        return undefined
    }


    let commentsData = []
    try {
        commentsData = await pb.collection('comments').getList(
            page, limitAmount,
            
            {
                filter: `attack="${aid}"`,
                expand: 'comments_via_reply_to, user,' + 
                'comments_via_reply_to.comments_via_reply_to, comments_via_reply_to.user,' + 
                'comments_via_reply_to.comments_via_reply_to.user', //holy nest batman
                sort: '-created'
            }

        ) as any
    } catch (error: unknown) {
        console.log(error)
    }

    return commentsData.items.map((comment: CommentSchema) => { return parseCommentInfo(comment) })
}


const getCommentsFromAttackHook = (aid?: string): [CommentSchema[] | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['attackComments', aid],
        queryFn: () => {
            return getCommentsFromAttack(aid)
        }
    })

    return [data, isLoading, error]
}


export {
    createComment,
    getCommentsFromAttackHook
}