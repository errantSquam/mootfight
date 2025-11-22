
import { getUsersHook, usersSearchHook } from "~/api/userApi";
import { Link, useSearchParams } from "react-router";
import { getPfp } from "~/functions/helper";
import { getProfileLink } from "~/functions/helper";
import type { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { ImageWithLoader } from "~/components/loaders";
import { MootButton } from "~/components/button";
import { SearchBar } from "~/components/search/searchBar";
import { charactersSearchHook } from "~/api/characterApi";

export function Search() {

    const [searchParams, setSearchParams] = useSearchParams();
    // maybe optimize this into two different pages with two different calls later.


    const isSearchEnabled = (searchType: string) => {
        let paramsType = searchParams.get("type")
        console.log(paramsType)
        console.log(paramsType === searchType)
        if (paramsType !== null && paramsType === searchType) {
            return true
        } else {
            return false

        }
    }

    let page = 1
    let limitAmount = 99
    const [users, usersLoading, usersError] = usersSearchHook(searchParams.get("query"),
        page, limitAmount, isSearchEnabled("user"));
    const [characters, charactersLoading, charactersError] = charactersSearchHook(searchParams.get("query"),
        page, limitAmount, isSearchEnabled("character"));


    return (
        <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
                <SearchBar />
                <div className="w-2/3 space-y-6 px-4">
                    <h3 className="ml-4">Results</h3>

                    <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                        <div>
                            <div className="flex flex-row gap-x-2">
                                {(isSearchEnabled("user") && !usersLoading) && users?.map((user) => {
                                    return <Link to={getProfileLink(user.username)}>
                                        <div className="flex flex-col text-center items-center" key={user.username}>
                                            <ImageWithLoader src={getPfp(user.id, user.profile_picture)} className="w-20 h-20 object-cover" />
                                            <span className="w-20 text-ellipsis overflow-hidden">{user.username}</span>
                                        </div></Link>
                                })}
                                {(isSearchEnabled("character") && !charactersLoading &&
                                characters?.map((chara) => {
                                    return <Link to={`/character/${chara.id}`}>
                                        <div className="flex flex-col text-center items-center" key={chara.name}>
                                            <ImageWithLoader src={chara.images[0].image_link} className="w-20 h-20 object-cover" />
                                            <span className="w-20 text-ellipsis overflow-hidden">{chara.name}</span>
                                        </div>

                                    </Link>
                                })
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}