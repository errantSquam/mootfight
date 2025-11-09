import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/firebase";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { DocumentSnapshot } from "firebase/firestore";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { getCharactersByUserHook } from "~/api/firebase";

export function ProfilePage() {
    let params = useParams();

    const [profileData, loading, error] = getUserInfoHook(params.userId)

    const [charaData, charaLoading, charaError] = getCharactersByUserHook(params.userId)

    const handleCharaData = (charaData: QuerySnapshot<DocumentData, DocumentData> | boolean | null | undefined) => {
        console.log(charaData)
        if (typeof charaData === "boolean" || charaData == null) {
            return []
        }
        let tempArray: CharacterSchema[] = []
        charaData.forEach((result) => {
            tempArray.push(result.data() as CharacterSchema)
        })
        return tempArray

    }


    function getProfileData(profileData: DocumentSnapshot<DocumentData, DocumentData> | undefined) {
        return profileData?.data()
    }



    //we NEED to switch to a provider. groans
    return (<ProfileLayout loading={loading} profileData={getProfileData(profileData) || {}} 
    charaData = {handleCharaData(charaData)}/>);
}