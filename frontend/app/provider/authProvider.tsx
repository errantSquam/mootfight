import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { signIn, auth, logOut } from "~/api/firebase"
import { getUserInfo } from "~/api/firebase";


const AuthContext = createContext<any>({ state: {}, actions: {} });

const AuthProvider = ({ children }: { children: any }) => {

    const [authLoaded, setAuthLoaded] = useState(false)
    const [userInfo, setUserInfo] = useState<UserSchema | null>(null)

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

    function updateUserInfo(newInfo: any, uid?:string) {

        let tempInfo = newInfo 
        if (tempInfo !== null && (uid !== null || uid !== undefined)) {
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