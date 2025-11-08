
import { getUsersHook } from "~/api/firebase";
import { Link } from "react-router";
import { getPfp } from "~/functions/helper";
import { getProfileLink } from "~/functions/helper";


export function Welcome() {

  const [snapshot, loading, error] = getUsersHook();

  function transformSnapshot(snapshotData: any) {
    let tempArray: any[] = []
      snapshotData.forEach((user: any) => {
        tempArray = [...tempArray, user.data()]
      })
    return tempArray

  }

  return (
    <div className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="flex flex-col items-center gap-9 text-xl">
          Welcome to Mootfight!
        </div>
        <div className="w-2/3 space-y-6 px-4">
          <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <div>
              <b>First Three Users</b>
              <div className = "flex flex-row gap-x-2">
              {!loading && transformSnapshot(snapshot).map((user) => {
                return <Link to = {getProfileLink(user.username, user.uid)}>
                  <div className = "flex flex-col items-center" key = {user.username}>
                  <img src = {getPfp(user.profilePicture)} className = "w-20"/>
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