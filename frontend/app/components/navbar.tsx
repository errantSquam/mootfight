import { signIn, auth } from "~/api/firebase"

export function Navbar() {
    return <div className = "fixed w-screen h-10 p-4 px-10 bg-zinc-900">
        <div className = "flex flex-row text-white gap-x-4 h-full items-center"> 
            <div>Home</div>
            {auth.currentUser === null && <div>Login </div>}
            {auth.currentUser !== null && <div>Submit Attack</div>}
        </div> 

    </div>
}