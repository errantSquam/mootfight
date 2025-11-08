import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/firebase";
import { getUserInfoByUsernameHook } from "~/api/firebase";
import { ProfileLayout } from "~/components/profile/profileLayout";

export function ProfilePage() {
    let params = useParams();

    const [profileData, loading, error] = getUserInfoHook(params.userId)

    function getProfileData(profileData: any ) {
        return profileData?.data()
    }



    return (<ProfileLayout loading = {loading} profileData = {getProfileData(profileData)}/>);
}