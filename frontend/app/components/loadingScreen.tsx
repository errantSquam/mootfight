
import { AuthContext } from "~/provider/authProvider"
import { useContext } from "react"

export function LoadScreen() {
    //const {authLoaded} = useContext(AuthContext)
    const authLoaded = true

    return <div className = {`fixed flex w-full h-full flex-col items-center justify-center transition duration-200
        bg-zinc-900 z-99 pointer-events-none ${authLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <img src = "/assets/images/loader.gif" className = "w-30" />
            <div className = "text-white"> Loading...</div>
        </div>

}


export function LoadScreenNoAuth({loadText = "Loading...", isLoading}:{loadText?:string, isLoading:boolean}) {

    return <div className = {`fixed flex w-full h-full flex-col items-center justify-center transition duration-200
        bg-zinc-900 z-99 pointer-events-none ${!isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <img src = "/assets/images/loader.gif" className = "w-30" />
            <div className = "text-white">{loadText}</div>
        </div>

}