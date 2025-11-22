import { handleError, pb  } from "./pocketbase"
import { ToastStatus } from "common";
import { getUserInfo } from "./userApi";
import { useQuery } from "@tanstack/react-query";


const createAttack = async (data: AttackSchema) => {
    try {
        //TODO: Batch update with notifications to the defenders as well? Or perhaps a Hook.

        pb.collection('attacks').create(data)
        return {
            toast_type: ToastStatus.SUCCESS,
            message: "Successfully created attack!"
        }

    } catch (error: unknown) {
        return handleError(error)
    }

}

const getAttack = async (aid?: string): Promise<AttackSchema | undefined> => {

    if (aid === undefined) {
        return undefined
    }
    
    let attackData = await pb.collection('attacks').getOne(aid) as AttackSchema
    return attackData
}

const getAttackHook = (aid?: string): [AttackSchema | undefined, boolean, Error | null] => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['attackInfo', aid],
        queryFn: () => {
            return getAttack(aid)
        }
    })

    return [data, isLoading, error]
}


export {
    createAttack,
    getAttack,
    getAttackHook
}