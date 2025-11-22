import { useState, useContext, createContext } from 'react';
import { useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { signIn,  logOut } from "~/api/pocketbase"
import { getUserInfo } from "~/api/userApi";
import type { DocumentData } from 'firebase/firestore';


type searchContextType = {
    searchQuery: string | undefined,
    setSearchQuery: React.Dispatch<React.SetStateAction<string | undefined>>,
}

const SearchContext = createContext<searchContextType>({ 
    searchQuery: undefined,
    setSearchQuery: () => {},
 });

const SearchProvider = ({ children }: { children: any }) => {

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)


    const value = { searchQuery, setSearchQuery };


    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export { SearchContext, SearchProvider };