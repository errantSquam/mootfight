import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { signIn, logOut } from "~/api/pocketbase"
import { getUserInfo } from "~/api/userApi";
import { pb } from '~/api/pocketbase';

type AuthContextType = {
    userInfo: UserRecord | null,
    setUserInfo: React.Dispatch<React.SetStateAction<UserRecord | null>>,
    authLoaded: boolean,
    refreshAuthUser: () => void
}

const AuthContext = createContext<AuthContextType>({ 
    userInfo: null,
    authLoaded: false,
    setUserInfo: () => {},
    refreshAuthUser: () => {}
 });

const AuthProvider = ({ children }: { children: any }) => {

    const [authLoaded, setAuthLoaded] = useState(false)
    const [userInfo, setUserInfo] = useState<UserRecord | null>(null)

    useEffect(() => {
        let localInfo = localStorage.getItem('userInfo')
        if (localInfo !== null) {
            setUserInfo(JSON.parse(localInfo))
            setAuthLoaded(true)
        }
    }, [])


    /*
    supabase.auth.onAuthStateChange((event, session) => {
        supabase.auth.getUser().then((user) => handleAuthStateChanged(user))
    });*/

    pb.authStore.onChange((token, record) => {
        handleAuthStateChanged(record as UserRecord), true
    })

    function updateUserInfo(newInfo:UserRecord | null | undefined, user_id?:string) {

        if (newInfo === undefined){
            console.log("Failed to fetch user document?")
            return
        }

        let tempInfo = newInfo 
        
        if (tempInfo !== null  && (user_id !== null && user_id !== undefined)) {
            if (userInfo !== null) {
                tempInfo['id'] = userInfo.id
            } else {
                tempInfo['id'] = user_id
            }
        }

        setUserInfo(newInfo)
        setAuthLoaded(true)
        try {
            if (newInfo === null) {
                localStorage.removeItem('userInfo')
            } else {
                localStorage.setItem('userInfo', JSON.stringify(newInfo))
            }

        } catch (e: unknown) {
        }
    }

    function handleAuthStateChanged(user: UserRecord | null) {
        if (user) {
            if (userInfo === null) {
                
                getUserInfo(user.id).then((resp) => {
                    updateUserInfo(resp, user.id)

                })
            }
        } else {
            updateUserInfo(null)
        }
    }

    const refreshAuthUser = () => {
        getUserInfo().then((resp) => {
            updateUserInfo(resp)
        })
    }

    const value = { userInfo, authLoaded, setUserInfo, refreshAuthUser };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };