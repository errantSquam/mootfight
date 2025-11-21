import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { getUserInfo, getUserInfoHook } from "~/api/userApi";
import { useParams } from 'react-router';
import { getCharactersByUserHook } from '~/api/characterApi';
import { getAttacksByUserHook } from '~/api/attackApi';
import { getDefencesByUserHook } from '~/api/attackApi';

type ProfileContextType = {
    profileData: UserAmbiguousSchema | undefined,
    profileLoading: boolean,
    charaData: CharacterSchema[] | undefined,
    charaLoading: boolean,
    attackData: AttackSchema[] | undefined,
    attackLoading: boolean,
    defenceData: AttackSchema[] | undefined,
    defenceLoading: boolean
}

const ProfileContext = createContext<ProfileContextType>(
    {
        profileData: undefined,
        profileLoading: true,
        charaData: undefined,
        charaLoading: true,
        attackData: undefined,
        attackLoading: true,
        defenceData: undefined,
        defenceLoading: true
    });

const ProfileProvider = ({ children }: { children: any }) => {
    let params = useParams();

    const [profileData, profileLoading, error]:
        [UserAmbiguousSchema | undefined, boolean, Error | null] = getUserInfoHook(params.userId)

    const [charaData, charaLoading, charaError]:
        [CharacterSchema[] | undefined, boolean, undefined] = getCharactersByUserHook(params.userId)
    const [attackData, attackLoading, attackError]:
        [AttackSchema[] | undefined, boolean, undefined] = getAttacksByUserHook(params.userId)

    const [defenceData, defenceLoading, defenceError]:
        [AttackSchema[] | undefined, boolean, undefined] = getDefencesByUserHook(params.userId)




    const value: ProfileContextType = {
        profileData,
        profileLoading,
        charaData,
        charaLoading,
        attackData,
        attackLoading,
        defenceData,
        defenceLoading
    };


    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileProvider };