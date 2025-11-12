import { getAttackHook } from "~/api/attackApi"
import { useParams } from "react-router"
import { useState } from "react"
import { SanitizedMarkdown } from "~/components/profile/sanitizedMarkdown"
import { getUserInfoHook } from "~/api/userApi"
import { getPfp } from "~/functions/helper"
export default function AttackPage() {
    let params = useParams()

    const [attackData, attackLoading, attackError] = getAttackHook(params.attackId)
    const [userData, userLoading, userError] = getUserInfoHook(attackData?.attacker || undefined)


    const [enlarge, setEnlarge] = useState(false)

    return <div className="flex flex-col items-center pb-10">
        <div className="flex flex-col gap-y-2 items-center w-2/3">
            <h1> {attackData?.title}</h1>
            <div className="italic text-zinc-400">{new Date(attackData?.creationDate || 0).toString()}</div>

            <img src={attackData?.image} className={`${enlarge ? "w-full" : "w-2/3"} cursor-pointer`}
                onClick={() => { setEnlarge(!enlarge) }}
            />
            <div className="flex flex-col items-start w-full gap-y-2">
                <div className="flex flex-row gap-x-2">
                    <img src={getPfp(userData?.profilePicture)} className="w-15" />
                    <div className="flex flex-col gap-x-1">
                        <div className="font-bold">{userData?.username}</div>
                        {userData?.pronouns && <div className="text-zinc-400 italic">({userData?.pronouns})</div>}
                    </div>
                </div>
                <div className = "ml-5 p-2 border-zinc-700 border-2 w-full rounded">
                <SanitizedMarkdown markdown={attackData?.description || '*This attack has no description.*'} />
                </div>
            </div>

            <hr />
            <div className="flex flex-col items-start w-full gap-y-2">
                <h3> Comments </h3>
                <div className = "ml-10">
                    {/*placeholder for now */}
                    <i>This attack has no comments.</i>
                </div>
            </div>

        </div>
    </div>
}