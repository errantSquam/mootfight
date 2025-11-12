import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { signIn, auth, logOut } from "~/api/firebase"
import { getUserInfo } from "~/api/userApi";
import type { DocumentData } from 'firebase/firestore';


type AuthContextType = {
    userInfo: DocumentData | null,
    setUserInfo: React.Dispatch<React.SetStateAction<DocumentData | null>>,
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
    const [userInfo, setUserInfo] = useState<DocumentData | null>(null)

    useEffect(() => {
        let localInfo = localStorage.getItem('userInfo')
        if (localInfo !== null) {
            setUserInfo(JSON.parse(localInfo))
            setAuthLoaded(true)
        }
    }, [])


    onAuthStateChanged(auth, (user) => {
        handleAuthStateChanged(user)
    });

    function updateUserInfo(newInfo: DocumentData | null | undefined, uid?:string) {

        if (newInfo === undefined){
            console.log("Failed to fetch user document?")
            return
        }

        let tempInfo = newInfo 
        if (tempInfo !== null  && (uid !== null && uid !== undefined)) {
            if (userInfo !== null) {
                tempInfo['uid'] = userInfo.uid
            } else {
                tempInfo['uid'] = uid
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

    function handleAuthStateChanged(user: User | null) {
        if (user) {
            if (userInfo === null) {
                getUserInfo(user.uid).then((resp) => {
                    updateUserInfo(resp, user.uid)

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