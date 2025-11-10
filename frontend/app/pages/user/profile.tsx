import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/userApi";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { DocumentSnapshot } from "firebase/firestore";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { getCharactersByUserHook } from "~/api/characterApi";

export function ProfilePage() {
    let params = useParams();

    const [profileData, loading, error] = getUserInfoHook(params.userId)

    const [charaData, charaLoading, charaError] = getCharactersByUserHook(params.userId)





    //we NEED to switch to a provider. groans
    return (<ProfileLayout loading={loading} profileData={profileData || {}} 
    charaData = {charaData || []}/>);
}