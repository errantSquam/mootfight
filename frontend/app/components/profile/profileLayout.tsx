
import { getPfp } from "~/functions/helper"
import { useForm, type SubmitHandler } from "react-hook-form"
import { SanitizedMarkdown } from "./sanitizedMarkdown"
import { useState, useContext } from "react"
import { handleToast } from "~/functions/handleToast"
import { AuthContext } from "~/provider/authProvider"
import { updateUserInfo } from "~/api/firebase"
import { ProfilePictureComponent } from "../settings/cropComponents"

type Inputs = {
    uid: string
    username: string
    email: string
    pronouns: string
    status: string
}

const MainProfileLayout = ({ loading, profileData }: { loading: boolean | undefined, profileData: any }) => {
    const { userInfo, refreshAuthUser } = useContext(AuthContext)
    const [profileTab, setProfileTab] = useState("Bio")
    const [isEditing, setIsEditing] = useState(false)

    const onSubmit: SubmitHandler<Inputs> = (data, e) => {
        updateUserInfo(data).then((resp) => {
            handleToast(resp)
            setIsEditing(false)
            refreshAuthUser()
        })

    }

    const profileTabs: any = {
        "Bio": "Bio Component Here",
        "Characters": "Characters Component Here",
        "Battles": "Component", //attacks/defences
        "Stats": "Component"
    }
    //maybe framer motion these tabs later


    return !loading && <div className="w-full h-full flex flex-col sm:flex-row">
        <div className="w-full h-screen bg-gray-500 flex-1 text-center text-gray-400">
            Featured Character WIP
        </div>
        <div className="w-full h-full flex flex-col items-start gap-y-2 flex-3 px-4">
            <div className="flex flex-col items-start justify-center w-full">
                <div className="flex flex-row items-center gap-x-2 w-full">
                    {/* <img src={getPfp(profileData?.profilePicture)} className="h-20" /> */}
                    <ProfilePictureComponent />
                    <div className="flex flex-col space-y-2 w-full grow">
                        <div className="flex flex-col grow items-start">
                            <div className="flex flex-row gap-x-2 items-center justify-center">
                                <div className="text-xl font-bold">{profileData?.username} </div>
                                <i className="opacity-70">{`(${profileData?.uid})`}</i>
                            </div>
                            <div>{profileData?.pronouns &&
                                <div className="">{profileData?.pronouns}</div>}
                            </div>
                            <div className="opacity-70 text-sm"><i>{profileData?.status}</i></div>
                        </div>
                        <div className="flex flex-col grow items-start">
                            <div className="flex flex-row gap-x-2">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row">
                <div className="flex flex-row w-fit">
                    {Object.keys(profileTabs).map((tabKey: string) => {
                        return <div onClick={() => { setProfileTab(tabKey) }} className={`py-1 px-4 transition select-none cursor-pointer border-b-2  ${profileTab === tabKey ? "border-b-white font-bold" : "border-slate-500"}`} key={tabKey}>
                            {tabKey}
                        </div>

                    })}
                </div>
                <div className="flex border-b-2 border-b-slate-500 w-full">

                </div>
            </div>
            <div className="w-2/3 space-y-6 px-4">
                <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                    <div>
                        {
                            (!loading) &&
                            <div>
                                <div><SanitizedMarkdown markdown={profileData?.bio} /></div>
                            </div>
                        }
                    </div>
                </div>
            </div></div>
    </div>
}

export function ProfileLayout({ children, loading, profileData, hasDuplicate = false }:
    { children?: any, loading: boolean | undefined, profileData: any, hasDuplicate?: boolean }) {
    return <div className="flex items-center justify-center">
        {!hasDuplicate && <MainProfileLayout loading={loading} profileData={profileData} />}
    </div>
}