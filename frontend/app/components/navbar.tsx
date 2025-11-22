import { signIn,  logOut } from "~/api/pocketbase"
import { Link } from "react-router"
import { handleToast } from "~/functions/handleToast"
import { useNavigate } from "react-router"
import { AuthContext } from "~/provider/authProvider"
import { useContext, useEffect } from "react"
import { Button, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { getPfp } from "~/functions/helper"
import { getProfileLink } from "~/functions/helper"

import { useState } from "react"

import { isScrolledNavbar, isScrolledBanner, useScrollDirection } from "./hooks/scrollHooks"


const SubmitDropdown = () => {
    return <Menu>
        <MenuButton className="text-white hover:cursor-pointer">
            Submit
            {/*<ChevronDownIcon className="size-4 fill-white/60" />*/}
        </MenuButton>

        <MenuItems
            transition
            anchor="bottom start"
            className="w-52 origin-top-right rounded-xl border border-white/5 bg-zinc-900/70 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
            <MenuItem>
                <Link to="/submit/character" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Character
                </Link>
            </MenuItem>
            <MenuItem>
                <Link to="/submit/attack" className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Attack
                </Link>
            </MenuItem>
        </MenuItems>
    </Menu>
}

const UserDropdown = ({ userInfo, userPfp }: { userInfo: any, userPfp: string }) => {
    let navigate = useNavigate()
    const handleLogout = async () => {
        let resp = await logOut()
        handleToast(resp)
        if (resp.toast_type === "success") {
            navigate("/")
        }
    }

    return <Menu>
        <MenuButton className="flex flex-row gap-x-4 items-center justify-center font-semibold text-white hover:cursor-pointer focus:outline-none">
            <img src={userPfp} className="h-10" />
            {<span className = "hidden md:inline">{userInfo.username}</span>}
            {/*<ChevronDownIcon className="size-4 fill-white/60" />*/}
        </MenuButton>

        <MenuItems
            transition
            anchor="bottom end"
            className="w-52 origin-top-right rounded-xl border border-white/5 
            bg-black/50 p-1 text-sm/6 text-white transition duration-100 
            ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
            <MenuItem>
                <Link to={getProfileLink(userInfo.username)} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
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
            {userInfo !== null &&
                <MenuItem>
                    <Button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10" onClick={() => handleLogout()}>
                        Logout
                    </Button>
                </MenuItem>
            }
        </MenuItems>
    </Menu>

}

export function Banner() {
    return <div className="h-24 w-screen flex">
          <Link to="/" className={`w-full min-h-full bg-center bg-cover cursor-pointer transition-all duration-300`} style={{
            backgroundImage: 'url("/assets/mootfight placeholder banner.png")'
          }}>
          </Link>
        </div>
}

export function Navbar() {
    const { userInfo, setUserInfo } = useContext(AuthContext)

    const scrollDirection = useScrollDirection();
    const isScrollBanner = isScrolledBanner();
    const isScrollNavbar = isScrolledNavbar();


    return <div className={`w-screen bg-zinc-900 flex flex-col items-center justify-between z-10 
        transition-all duration-300 sticky ${scrollDirection === 'up' ? 'top-0' : '-top-100'}`}>
        {/*<Link to = "/" className={` w-full bg-center bg-cover cursor-pointer transition-all duration-300
        ${isScrollBanner ? 'h-0' : 'h-24'}`} style={{
                backgroundImage: 'url("/assets/mootfight placeholder banner.png")'
            }}>
        </Link>*/}
        <div/>
        <div className={`p-4 px-10 h-10 flex flex-row text-white gap-x-4 justify-between w-full items-center `}>
            <div className="flex flex-row gap-x-4 h-full items-center">
                <div><Link to="/">Home</Link></div>
                {userInfo !== null && <div><SubmitDropdown /></div>}
            </div>
            <div className="flex flex-row gap-x-4 h-full items-center">
                {userInfo === null && <div><Link to="login">Login </Link></div>}
                <div>
                    {userInfo !== null && <UserDropdown userInfo={userInfo} userPfp={getPfp(userInfo?.id, userInfo?.profile_picture)} />}
                </div>
            </div>

        </div>
        </div>
}