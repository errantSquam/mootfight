import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { signIn, auth, logOut } from "~/api/firebase"
import { getUserInfo } from "~/api/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';


const AuthContext = createContext<any>({ state: {}, actions: {} });

const AuthProvider = ({ children }: { children: any }) => {
    const [authUser, loading, error] = useAuthState(auth);

    const [authLoaded, setAuthLoaded] = useState(false)
    const [userInfo, setUserInfo] = useState<any>(null)

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

    function updateUserInfo(newInfo: any) {
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
                    updateUserInfo(resp)

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