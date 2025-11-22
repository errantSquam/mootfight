import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { getUserInfo, getUserInfoByUsernameHook, getUserInfoHook } from "~/api/userApi";
import { useParams } from 'react-router';

type ProfileContextType = {
    profileData: UserAmbiguousSchema | undefined,
    profileLoading: boolean
}

const ProfileContext = createContext<ProfileContextType>(
    {
        profileData: undefined,
        profileLoading: true,
    });

const ProfileProvider = ({ children }: { children: any }) => {
    let params = useParams();

    const [profileData, profileLoading, error]:
        [UserAmbiguousSchema | undefined, boolean, Error | null] = getUserInfoByUsernameHook(params.username)





    const value: ProfileContextType = {
        profileData,
        profileLoading,
    };


    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileProvider };