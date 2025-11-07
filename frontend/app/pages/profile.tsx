import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/firebase";
import { getUserInfoByUsernameHook } from "~/api/firebase";


export function ProfilePage() {
    let params = useParams();
    //params.userId

    const [profileData, loading, error] = getUserInfoByUsernameHook(params.username)

    function getProfileData(profileData: QuerySnapshot<DocumentData, DocumentData> | boolean | undefined ) {
        if (typeof profileData === "boolean" || profileData === undefined) {
            return undefined
        } 
        return profileData.docs[0].data()
        
        


    }



    return (
        <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                <div className="flex flex-col items-center gap-9">
                    {
                        (!loading) && <div className="flex flex-row items-center gap-x-2">
                            <img src={getProfileData(profileData)?.profilePicture === undefined ?
                                "/assets/images/default owlcroraptor.png" :
                                getProfileData(profileData)?.profilePicture

                            } className="h-20" />
                            <div className="flex flex-col">
                                <div className = "flex flex-row gap-x-2">
                                    <div>{getProfileData(profileData)?.username} </div>
                                    <div>{getProfileData(profileData)?.pronouns && 
                                    <i className="opacity-70">({getProfileData(profileData)?.pronouns})</i>}
                                    </div>
                                </div>
                                <div className="opacity-70 text-sm"><i>{getProfileData(profileData)?.status}</i></div>
                            </div>
                        </div>
                    }
                </div>
                <div className="w-2/3 space-y-6 px-4">
                    <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                        <div>
                            {
                                (!loading) &&
                                <div>
                                    <div>{getProfileData(profileData)?.username}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}