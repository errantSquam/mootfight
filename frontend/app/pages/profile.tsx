import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/firebase";


export function ProfilePage() {
    let params = useParams();
    //params.userId

    const [profileData, loading, error] = getUserInfoHook(params.userId)



    return (
        <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                <div className="flex flex-col items-center gap-9">
                    {
                        (!loading) && <div className="flex flex-row items-center gap-x-2">
                            <img src={profileData?.data()?.profilePicture === undefined ?
                                "/assets/images/default owlcroraptor.png" :
                                profileData?.data()?.profilePicture

                            } className="h-20" />
                            <div className="flex flex-col">
                                <div>{profileData?.data()?.username} {profileData?.data()?.pronouns && <i className="opacity-70">({profileData?.data()?.pronouns})</i>}</div>
                                <div className="opacity-70 text-sm"><i>{profileData?.data()?.status}</i></div>
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
                                    <div>{profileData?.data()?.username}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}