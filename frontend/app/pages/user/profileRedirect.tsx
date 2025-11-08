import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { getUserInfoByUsernameHook } from "~/api/firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { getPfp } from "~/functions/helper";
import { useState } from "react";
import { Link } from "react-router";
import { getProfileLink } from "~/functions/helper";

export function ProfileRedirectPage() {
    let params = useParams();
    let navigate = useNavigate()
    //params.userId

    const [profileData, loading, error] = getUserInfoByUsernameHook(params.username)
    const [hasDuplicate, setHasDuplicate] = useState(false)

    function getProfileData(profileData: QuerySnapshot<DocumentData, DocumentData> | boolean | undefined ) {
        if (typeof profileData === "boolean" || profileData === undefined) {
            return {}
        } 
        return profileData.docs[0].data()
    }

    function getAlternateProfileData(profileData: QuerySnapshot<DocumentData, DocumentData> | boolean | undefined ) {
        if (typeof profileData === "boolean" || profileData === undefined) {
            return undefined
        } 
        let tempArray: DocumentData[] = []
        profileData.forEach((user) => {
            tempArray.push(user.data())
        })
        return tempArray
    }

    function checkProfileData(profileData: QuerySnapshot<DocumentData, DocumentData> | boolean | undefined ) {
        if (typeof profileData === "boolean" || profileData === undefined) {
            return undefined
        } 
        return profileData.size
    }

    useEffect(() => {
        let profileCount = checkProfileData(profileData)
        if (profileCount !== undefined) {
            if (profileCount <= 1) {
                let data = getProfileData(profileData) 
                navigate(`/user/profile/${encodeURIComponent(data.username)}/${data.uid}`)
            } else {
                setHasDuplicate(true)
            }
        }
    }, [loading])



    return <ProfileLayout loading = {loading} profileData = {getProfileData(profileData)}
    hasDuplicate = {hasDuplicate}
    >
        
    {(!loading && hasDuplicate) && 
        <div className = "flex flex-col items-center space-y-2"> 
            <div>Who are you looking for?</div>
            <div className = "grid grid-cols-2 space-x-4">
            {getAlternateProfileData(profileData)?.map(
                (user) => {
                    return <Link to = {getProfileLink(user.username, user.uid)}><div className = "flex flex-col items-center">
                                <img src = {getPfp(user.profilePicture)} className = "h-20 w-20"/>
                                <div>{user.username}</div>
                                <div className = "text-xs opacity-60 italic">ID: {user.uid}</div>

                            </div>
                            </Link>
                }
            )}
            </div>

        </div>
    }
        </ProfileLayout>
}