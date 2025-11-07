
import { getPfp } from "~/functions/helper"


export function ProfileLayout({children, loading, profileData, hasDuplicate = false} : 
    {children?: any, loading: boolean | undefined, profileData: any, hasDuplicate : boolean}) {
    return <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                            <div>{children}</div>

                { !hasDuplicate &&
                <>
                <div className="flex flex-col items-center gap-9">
                    {
                        (!loading) && <div className="flex flex-row items-center gap-x-2">
                            <img src={getPfp(profileData?.profilePicture)

                            } className="h-20" />
                            <div className="flex flex-col">
                                <div className = "flex flex-row gap-x-2">
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
                <div className="w-2/3 space-y-6 px-4">
                    <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                        <div>
                            {
                                (!loading) &&
                                <div>
                                    <div>{profileData?.username}</div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                </>
                }
    
            </div>

        </div>
}