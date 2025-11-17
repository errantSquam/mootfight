
import { getUsersHook } from "~/api/userApi";
import { Link } from "react-router";
import { getPfp } from "~/functions/helper";
import { getProfileLink } from "~/functions/helper";
import type { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { ImageWithLoader } from "~/components/loaders";
import { MootButton } from "~/components/button";
import { SearchBar } from "~/components/search/searchBar";

export function Search() {

  const [snapshot, loading, error] = getUsersHook(99);

  function transformSnapshot(snapshotData: QuerySnapshot<DocumentData, DocumentData> | undefined) {
    if (snapshotData === undefined) {
      return []
    }
    let tempArray: DocumentData[] = []
    snapshotData.forEach((user: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
      tempArray = [...tempArray, user.data()]
    })
    return tempArray

  }

  return (
    <div className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <SearchBar/>
        <div className="w-2/3 space-y-6 px-4">
          <h3 className="ml-4">Results</h3>

          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <div>
              <div className="flex flex-row gap-x-2">
                {!loading && transformSnapshot(snapshot).map((user) => {
                  return <Link to={getProfileLink(user.username, user.uid)}>
                    <div className="flex flex-col items-center" key={user.username}>
                      <ImageWithLoader src={getPfp(user.profilePicture)} className="w-20 h-20 object-cover" />
                      <span className = "w-20 text-ellipsis overflow-hidden">{user.username}</span>
                    </div></Link>
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}