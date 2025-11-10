
import { getPfp } from "~/functions/helper"
import { useForm, type SubmitHandler } from "react-hook-form"
import { SanitizedMarkdown } from "./sanitizedMarkdown"
import { useState, useContext, type JSX } from "react"
import { handleToast } from "~/functions/handleToast"
import { AuthContext } from "~/provider/authProvider"
import { updateUserInfo } from "~/api/userApi"
import { ProfilePictureComponent } from "../settings/cropComponents"
import { ProfileBioTab, ProfileCharactersTab, ProfileBattlesTab, ProfileStatsTab } from "./profileTabs"
import { getCharactersByUserHook } from "~/api/characterApi"
import type { DocumentData, QuerySnapshot } from "firebase/firestore"


type Inputs = {
    uid: string
    username: string
    email: string
    pronouns: string
    status: string
}

const MainProfileLayout = ({ loading, profileData, charaData }:
    {
        loading: boolean | undefined,
        profileData: UserAmbiguousSchema,
        charaData: CharacterSchema[],
    }) => {
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



    //Seems kinda ass to pass in profile data like that lol. Is there a way we could use a context...?

    const profileTabs: { [index: string]: JSX.Element } = {
        "Bio": <ProfileBioTab profileData={profileData} />,
        "Characters": <ProfileCharactersTab profileData={profileData}
            charaData={charaData} />,
        "Battles": <ProfileBattlesTab profileData={profileData} />, //attacks/defences
        "Stats": <ProfileStatsTab profileData={profileData} />
    }


    //maybe framer motion these tabs later


    return !loading && <div className="w-full h-full flex flex-col sm:flex-row">
        <div className="w-full h-screen bg-gray-500 flex-1 text-center text-gray-400">
            Featured Character WIP
        </div>
        <div className="w-full h-full flex flex-col items-start gap-y-2 flex-3 px-4">
            <div className="flex flex-col items-start justify-center w-full">
                <div className="flex flex-row items-center gap-x-2 w-full">
                    <div className="p-2">
                        <img src={getPfp(profileData?.profilePicture)} className="w-30 rounded-full" />
                        {/*
                        Put pfp component here if user is editing...
                        <ProfilePictureComponent />
                        */}
                    </div>
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
            <div className="w-full space-y-6 px-4">
                <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                    {
                        (!loading) &&
                        profileTabs[profileTab]
                    }
                </div>
            </div></div>
    </div>
}

export function ProfileLayout({ children, loading, profileData, charaData, hasDuplicate = false }:
    {
        children?: any, loading: boolean | undefined, profileData: any,
        charaData: CharacterSchema[],
        hasDuplicate?: boolean
    }) {
    return <div className="flex items-center justify-center">
        {!hasDuplicate && <MainProfileLayout loading={loading} profileData={profileData} charaData = {charaData}/>}
    </div>
}