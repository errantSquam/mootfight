import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getUserInfoHook } from "~/api/userApi";
import { LoadScreen } from "~/components/loadingScreen";
import { ProfileLayout } from "~/components/profile/profileLayout";
import { ProfileProvider } from "~/provider/profileProvider";
import { getUserInfo } from "~/api/userApi";
import { getProfileLink } from "~/functions/helper";

export function ProfileIdRedirect() {
    let params = useParams();
    let navigate = useNavigate()


    useEffect(() => {
        getUserInfo(params.id).then((resp) => {
            navigate(getProfileLink(resp.username || ''))
        })


    }, [params.id])


    //we NEED to switch to a provider. groans

    return <LoadScreen />

}