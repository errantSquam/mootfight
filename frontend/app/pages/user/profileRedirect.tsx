import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { getUserInfoByUsernameHook } from "~/api/userApi";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { getPfp } from "~/functions/helper";
import { useState } from "react";
import { Link } from "react-router";
import { getProfileLink } from "~/functions/helper";
import { getCharactersByUserHook } from "~/api/characterApi";
import { getAttacksByUserHook } from "~/api/attackApi"

export function ProfileRedirectPage() {
    let params = useParams();
    let navigate = useNavigate()
    //params.userId

    const [profileData, loading, error] = getUserInfoByUsernameHook(params.username)
    const [hasDuplicate, setHasDuplicate] = useState(false)

    const [charaData, charaLoading, charaError] = getCharactersByUserHook(params.userId)
    const [attackData, attackLoading, attackError] = getAttacksByUserHook(params.userId)

    

    useEffect(() => {
        let profileCount = profileData.length
        if (profileCount !== undefined) {
            if (profileCount <= 1) {
                let data = profileData[0]
                navigate(`/user/profile/${encodeURIComponent(data.username || '')}/${data.uid}`)
            } else {
                setHasDuplicate(true)
            }
        }
    }, [loading])



    return <ProfileLayout loading={loading} profileData={profileData[0]}
        hasDuplicate={hasDuplicate} charaData = {charaData || []}
        attackData={attackData || []}
    >
        {(!loading && hasDuplicate) &&
            <div className="flex flex-col items-center space-y-2">
                <div>Who are you looking for?</div>
                <div className="grid grid-cols-2 space-x-4">
                    {profileData?.map(
                        (user) => {
                            return <Link to={getProfileLink(user.username, user.uid)}><div className="flex flex-col items-center">
                                <img src={getPfp(user.profilePicture)} className="h-20 w-20" />
                                <div>{user.username}</div>
                                <div className="text-xs opacity-60 italic">ID: {user.uid}</div>

                            </div>
                            </Link>
                        }
                    )}
                </div>

            </div>
        }
    </ProfileLayout>
}