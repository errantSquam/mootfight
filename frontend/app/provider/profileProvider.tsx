import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { signIn, auth, logOut } from "~/api/firebase"
import { getUserInfo, getUserInfoHook } from "~/api/userApi";
import type { DocumentData, Firestore, FirestoreError } from 'firebase/firestore';
import { useParams } from 'react-router';
import { getCharactersByUserHook } from '~/api/characterApi';
import { getAttacksByUserHook } from '~/api/attackApi';

type ProfileContextType = { 
    profileData: UserAmbiguousSchema | undefined,
    profileLoading: boolean,
    charaData: CharacterSchema[] | undefined, 
    charaLoading: boolean,
    attackData: AttackSchema[] | undefined,
    attackLoading: boolean 
    }

const ProfileContext = createContext<ProfileContextType>(
    { 
        profileData: undefined,
        profileLoading: true,
        charaData: undefined,
        charaLoading: true,
        attackData: undefined,
        attackLoading: true
    });

const ProfileProvider = ({ children }: { children: any }) => {
    let params = useParams();

    const [profileData, profileLoading, error] : 
    [UserAmbiguousSchema | undefined, boolean, FirestoreError | undefined] = getUserInfoHook(params.userId)

    const [charaData, charaLoading, charaError] :
    [CharacterSchema[] | undefined, boolean, FirestoreError | undefined] = getCharactersByUserHook(params.userId)
    const [attackData, attackLoading, attackError] : 
    [AttackSchema[] | undefined, boolean, FirestoreError | undefined] = getAttacksByUserHook(params.userId)


    

    const value: ProfileContextType = { profileData, 
        profileLoading, 
        charaData, 
        charaLoading, 
        attackData, 
        attackLoading };


    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export { ProfileContext, ProfileProvider };