import { signIn, auth, logOut } from "~/api/firebase"
import { Link } from "react-router"
import { useOutletContext } from "react-router"
import { handleToast } from "~/functions/handleToast"
import { useNavigate } from "react-router"
import { onAuthStateChanged } from "firebase/auth"
import { useState } from "react"

export function Navbar() {
    const [isSignedIn, setSignedIn] = useState(false)

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setSignedIn(true)
        } else {
            setSignedIn(false)
        }
    });

    let navigate = useNavigate()

    const handleLogout = async () => {
        let resp = await logOut()
        handleToast(resp)
        if (resp.toastType === "success") {
            navigate("/")

        }
    }


    return <div className="fixed w-screen h-10 p-4 px-10 bg-zinc-900">
        <div className="flex flex-row text-white gap-x-4 h-full items-center">
            <div><Link to="/">Home</Link></div>
            {auth.currentUser === null && <div><Link to="login">Login </Link></div>}
            {auth.currentUser !== null && <div><Link to="submit/attack">Submit Attack</Link></div>}
            {auth.currentUser !== null && <div className="cursor-pointer" onClick={() => handleLogout()}>Logout</div>}
        </div>

    </div>
}