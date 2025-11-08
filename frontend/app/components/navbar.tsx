import { signIn, auth, logOut } from "~/api/firebase"
import { Link } from "react-router"
import { useOutletContext } from "react-router"
import { handleToast } from "~/functions/handleToast"
import { useNavigate } from "react-router"
import { onAuthStateChanged } from "firebase/auth"
import { useState } from "react"
import { AuthContext } from "~/provider/authProvider"
import { useContext } from "react"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Icon } from "@iconify/react";
import { getPfp } from "~/functions/helper"
import { getProfileLink } from "~/functions/helper"



const SubmitDropdown = () => {
    return <Menu>
        <MenuButton className="text-white hover:cursor-pointer">
            Submit
            {/*<ChevronDownIcon className="size-4 fill-white/60" />*/}
        </MenuButton>

        <MenuItems
            transition
            anchor="bottom start"
            className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
            <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Character
                </button>
            </MenuItem>
            <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Attack
                </button>
            </MenuItem>
        </MenuItems>
    </Menu>
}

const UserDropdown = ({ userInfo }: { userInfo: any }) => {
    return <Menu>
        <MenuButton className="font-semibold text-white hover:cursor-pointer">
            {userInfo.username}
            {/*<ChevronDownIcon className="size-4 fill-white/60" />*/}
        </MenuButton>

        <MenuItems
            transition
            anchor="bottom end"
            className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
            <MenuItem>
                <Link to={getProfileLink(userInfo.username, userInfo.uid)} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Profile
                </Link>
            </MenuItem>
            <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Notifications
                </button>
            </MenuItem>
            <MenuItem>
                <Link to='/user/settings' className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Settings
                </Link>
            </MenuItem>
        </MenuItems>
    </Menu>
}

export function Navbar() {
    const { userInfo, setUserInfo } = useContext(AuthContext)

    let navigate = useNavigate()

    const handleLogout = async () => {
        let resp = await logOut()
        handleToast(resp)
        if (resp.toastType === "success") {
            navigate("/")

        }
    }


    return <div className="fixed w-screen h-10 p-4 px-10 bg-zinc-900 flex items-center">
        <div className="flex flex-row text-white gap-x-4 justify-between w-full items-center">
            <div className="flex flex-row gap-x-4 h-full items-center">
                <div><Link to="/">Home</Link></div>
                {userInfo === null && <div><Link to="login">Login </Link></div>}
                {userInfo !== null && <div><SubmitDropdown/></div>}
                {userInfo !== null && <div className="cursor-pointer" onClick={() => handleLogout()}>Logout</div>}
            </div>
            <div className="flex flex-row gap-x-4 h-full items-center">
                <div>{userInfo !== null && <img src={getPfp(userInfo?.profilePicture)} className="h-10" />}</div>
                <div>{userInfo !== null && <UserDropdown userInfo={userInfo} />}</div>
            </div>
        </div>

    </div>
}