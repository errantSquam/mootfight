import { SanitizedMarkdown } from "./sanitizedMarkdown"

export const ProfileBioTab = ({ profileData }: { profileData: UserAmbiguousSchema }) => {
    return <SanitizedMarkdown markdown={profileData.bio || ''} />

}

export const ProfileCharactersTab = ({ profileData }: { profileData: UserAmbiguousSchema }) => {
    //todo: characters
    /*
    characters should be an array of IDs pointing to said character, maybe?
    or maybe characters should have an owner id and we query from there...
    */
    return <div>
        Characters
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

