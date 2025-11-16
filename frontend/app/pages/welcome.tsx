
import { getUsersHook } from "~/api/userApi";
import { Link } from "react-router";
import { getPfp } from "~/functions/helper";
import { getProfileLink } from "~/functions/helper";
import type { DocumentData, QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { ImageWithLoader } from "~/components/loaders";
import { MootButton } from "~/components/button";

export function Welcome() {

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
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="flex flex-col w-full items-center">
          <h3> Search </h3>
          <input type="text" className="py-1 px-2 w-1/2 border border-zinc-500"
            placeholder="Search user/character..." />
          <div className="flex flex-row w-1/2 px-8 py-4 justify-between">
            <MootButton>
                Search User
            </MootButton>

            <MootButton>
                Search Character
            </MootButton>
          </div>

        </div>
        <div className="w-2/3 space-y-6 px-4">
          <h3 className="ml-4">Active Users</h3>

          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <div>
              <div className="flex flex-row gap-x-2">
                {!loading && transformSnapshot(snapshot).map((user) => {
                  return <Link to={getProfileLink(user.username, user.uid)}>
                    <div className="flex flex-col items-center" key={user.username}>
                      <ImageWithLoader src={getPfp(user.profilePicture)} className="w-20 h-20 object-cover" />
                      <span>{user.username}</span>
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