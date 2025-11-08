
import { getPfp } from "~/functions/helper"

import { SanitizedMarkdown } from "./sanitizedMarkdown"
import { useState } from "react"

const MainProfileLayout = ({ loading, profileData }: { loading: boolean | undefined, profileData: UserAmbiguousSchema }) => {

    const [profileTab, setProfileTab] = useState("Bio")

    const profileTabs: any = {
        "Bio": "Bio Component Here",
        "Characters": "Characters Component Here",
        "Battles": "Component", //attacks/defences
        "Stats": "Component"
    }
    //maybe framer motion these tabs later



    return <div className="w-full flex flex-col items-center gap-y-2">
        <div className="flex flex-col items-center">
            {
                (!loading) && <div className="flex flex-row items-center gap-x-2">
                    <img src={getPfp(profileData?.profilePicture)

                    } className="h-20" />
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-x-2">
                            <div>{profileData?.username} </div>
                            <div>{profileData?.pronouns &&
                                <i className="opacity-70">({profileData?.pronouns})</i>}
                            </div>
                        </div>
                        <div className="opacity-70 text-sm"><i>{profileData?.status}</i></div>
                    </div>
                </div>
            }
        </div>
        <div className="flex flex-row gap-x-2">

            {Object.keys(profileTabs).map((tabKey: string) => {
                return <div onClick = {() => {setProfileTab(tabKey)}} className={`py-1 px-2 rounded-xl border-zinc-500 border bg-zinc-900 
                hover:bg-zinc-700 transition select-none cursor-pointer`} key = {tabKey}>
                    {tabKey}
                </div>

            })}
        </div>
        <div className="w-2/3 space-y-6 px-4">
            <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                <div>
                    {
                        (!loading && profileData.bio) &&
                        <div>
                            <div><SanitizedMarkdown markdown={profileData.bio} /></div>
                        </div>
                    }
                </div>
            </div>
        </div></div>
}

export function ProfileLayout({ children, loading, profileData, hasDuplicate = false }:
    { children?: any, loading: boolean | undefined, profileData: UserAmbiguousSchema, hasDuplicate?: boolean }) {
    return <div className="flex items-center justify-center pb-4">
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
            <div>{children}</div>

            {!hasDuplicate && <MainProfileLayout loading={loading} profileData={profileData} />
            }

        </div>

    </div>
}