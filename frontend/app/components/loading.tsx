
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "~/api/firebase";
import { useState } from "react"


export function LoadScreen() {
    const [authLoaded, setAuthLoaded] = useState(false)

    onAuthStateChanged(auth, (user) => {
        setAuthLoaded(true)
    });
    return <div className = {`fixed flex w-full h-full flex-col items-center justify-center transition duration-200
        bg-zinc-900 z-99 pointer-events-none ${authLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <img src = "assets/images/loader.gif" className = "w-30" />
            <div className = "text-white"> Loading...</div>
        </div>

}