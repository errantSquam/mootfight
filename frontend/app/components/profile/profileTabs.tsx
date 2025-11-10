import { SanitizedMarkdown } from "./sanitizedMarkdown"
import { ImageWithLoader } from "../loaders"
import { Link } from "react-router"

export const ProfileBioTab = ({ profileData }: { profileData: UserAmbiguousSchema }) => {
    return <SanitizedMarkdown markdown={profileData.bio || ''} />

}

export const ProfileCharactersTab = ({ profileData, charaData }: 
    { profileData: UserAmbiguousSchema, charaData: CharacterSchema[] }) => {
    //todo: characters
    /*
    characters should be an array of IDs pointing to said character, maybe?
    or maybe characters should have an owner id and we query from there...
    */
   const characterLimit = 30
    return <div>
        <h1>Characters</h1>
        <div className = "grid grid-cols-4 gap-x-2">
            {
                charaData.map((chara) => {
                    console.log(charaData)
                    return <Link to ={`/character/${chara.cid}`} className = "flex flex-col items-center">
                        <ImageWithLoader src = {chara.images[0].imageLink} className = "w-40 h-40 object-cover"/>
                        <div className = "w-40 text-center text-ellipsis overflow-hidden">{chara.name.substring(0, characterLimit)}</div>

                    </Link>
                })
            }

        </div>
    </div>

}

export const ProfileBattlesTab = ({ profileData }: { profileData: UserAmbiguousSchema }) => {
    //todo: battles — attacks and defences!
    /*
    Might need to come up with a firebase query to find all attacks and defences per user...
    */
    return <div>
        <div>Attacks</div>
        <div>Defences</div>
    </div>

}

export const ProfileStatsTab = ({ profileData }: { profileData: UserAmbiguousSchema }) => {
    //todo: stats
    /*
    need unique query i think...
    */
    return <div>
        <div>Ratio (Quantity)</div>
        <div>Ratio (Points)</div>
    </div>

}

