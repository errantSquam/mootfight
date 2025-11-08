import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/firebase";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { DocumentSnapshot } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

export function ProfilePage() {
    let params = useParams();

    const [profileData, loading, error] = getUserInfoHook(params.userId)

    function getProfileData(profileData: DocumentSnapshot<DocumentData, DocumentData> | undefined ) {
        return profileData?.data()
    }



    return (<ProfileLayout loading = {loading} profileData = {getProfileData(profileData) || {}}/>);
}