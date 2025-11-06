import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { signIn, auth, logOut } from "~/api/firebase"
import { getUserInfoFromUid } from "~/api/firebase";

const AuthContext = createContext<any>({ state: {}, actions: {} });

const AuthProvider = ({ children }: { children: any }) => {

    const [authLoaded, setAuthLoaded] = useState(false)
    const [userInfo, setUserInfo] = useState<any>(null)
    const value = { userInfo, authLoaded, setUserInfo };

    onAuthStateChanged(auth, (user) => {
        handleAuthStateChanged(user)
    });

    function handleAuthStateChanged(user: User | null) {
        if (user) {
            if (userInfo === null) {
                getUserInfoFromUid(user.uid).then((resp) => {
                    setUserInfo(resp)
                    setAuthLoaded(true)

                })
            }
        } else {
            setUserInfo(null)
        }
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };