import { SanitizedMarkdown } from "./sanitizedMarkdown"
import { Icon } from "@iconify/react"
import { useState } from "react"

export const ProfileBioTab = ({ profileData }: { profileData: UserAmbiguousSchema }) => {
    return <SanitizedMarkdown markdown={profileData.bio || ''} />

}

const ImageSkeletonComponent = ({className} : {className:string}) => {
    return <div className={`flex items-center justify-center ${className}
    rounded-sm bg-gray-700`}>
        <Icon icon = "material-symbols:image-outline-rounded" className="w-10 h-10 text-gray-200 dark:text-gray-600" />
    </div>
}

const ImageWithLoader = ({src, className}: {src: string, className:string}) => {
    const [isLoading, setIsLoading] = useState(true)

    return <>
    <img src = {src} onLoad = {() => setIsLoading(false)} 
    className = {`${className} ${isLoading ? "opacity-0":"opacity-100"}`}/>
    <ImageSkeletonComponent className = {`${className} ${isLoading ? "visible":"hidden"}`}/>

    
    </>


}

export const ProfileCharactersTab = ({ profileData, charaData }: 
    { profileData: UserAmbiguousSchema, charaData: CharacterSchema[] }) => {
    //todo: characters
    /*
    characters should be an array of IDs pointing to said character, maybe?
    or maybe characters should have an owner id and we query from there...
    */
    return <div>
        <h1>Characters</h1>
        <div className = "flex flex-row">
            {
                charaData.map((chara) => {
                    console.log(charaData)
                    return <div className = "flex flex-col items-center">
                        <ImageWithLoader src = {chara.images[0].imageLink} className = "w-40 h-40 object-cover"/>
                        <div>{chara.name}</div>

                    </div>
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

