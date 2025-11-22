import { SanitizedMarkdown } from "./sanitizedMarkdown"
import { ImageWithLoader } from "../loaders"
import { Link } from "react-router"
import { ProfileContext } from "~/provider/profileProvider"
import { useContext } from "react"

export const ProfileBioTab = () => {
    const { profileLoading, profileData} = useContext(ProfileContext)

    return <SanitizedMarkdown markdown={profileData?.bio || ''} />

}

export const ProfileCharactersTab = () => {
    const { profileLoading, profileData} = useContext(ProfileContext)

    //todo: characters
    /*
    characters should be an array of IDs pointing to said character, maybe?
    or maybe characters should have an owner id and we query from there...
    */
    const characterLimit = 30
    return <div>
        <h1>Characters</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2">
            {
                profileData?.characters?.map((chara) => {
                    console.log(chara)
                    return <Link to={`/character/${chara.id}`} className="flex flex-col items-center">
                        <ImageWithLoader src={chara.images[0].image_link} className="w-40 h-40 object-cover" />
                        <div className="w-40 text-center text-ellipsis overflow-hidden">{chara.name.substring(0, characterLimit)}</div>

                    </Link>
                })
            }

        </div>
    </div>

}

const AttacksArray = ({attackData}: {attackData: AttackSchema[] | undefined}) => {
    return <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2">{
            attackData?.map((attack) => {
                return <Link to={`/attack/${attack.id}`} className="flex flex-col items-center" key = {attack.id}>
                    <ImageWithLoader src={attack.image_link} className="w-40 h-40 object-cover" 
                    spoiler = {attack?.warnings}/>
                    <div className="w-40 text-center text-ellipsis overflow-hidden">{attack.title}</div>

                </Link>
            })}</div>

}

export const ProfileBattlesTab = () => {
    const { profileLoading, profileData } = useContext(ProfileContext)

    //todo: battles — attacks and defences!


    return <div>
        <h3>Attacks</h3>
        <AttacksArray attackData = {profileData?.attacks}/>
        <h3>Defences</h3>
        <AttacksArray attackData = {profileData?.defences}/>
    </div>

}

export const ProfileStatsTab = () => {
    const { profileLoading, profileData} = useContext(ProfileContext)

    //todo: stats
    /*
    need unique query i think...
    */
    return <div>
        <div>Ratio (Quantity)</div>
        <div>Ratio (Points)</div>
    </div>

}

