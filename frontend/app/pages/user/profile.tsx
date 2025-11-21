import { useParams } from "react-router";
import { getUserInfoHook } from "~/api/userApi";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { getCharactersByUserHook } from "~/api/characterApi";
import { getAttacksByUserHook } from "~/api/attackApi"
import { ProfileProvider } from "~/provider/profileProvider";

export function ProfilePage() {
    let params = useParams();




    //we NEED to switch to a provider. groans
    return (
    <ProfileProvider><ProfileLayout/> </ProfileProvider>);
}