interface UserSchema {
    username:string,
    profile_picture?:string,
    pronouns?:string,
    status?:string,
    id:string,
    bio?:string,
    permissions?: string

}

interface UserAmbiguousSchema extends UserSchema {
    username?:string,
    id?:string
}

interface BioUserSchema extends UserSchema {
    bio: string
}


type ToastResponse = {
    toast_type: ToastStatus,
    message: string,
    data?: any
}


type RefImage = {
    image_link: string,
    artist?: string,
    artist_link?: string
}

interface CharacterSchema {
    name: string,
    pronouns?: string,
    status?: string,
    description?: string,
    permissions?: string,
    images: RefImage[],
    owner_id: string
    id?: string
}


type AttackSchema = {
    image_link: string,
    description: string | undefined,
    attacker: string,
    defenders: string[],
    characters: string[],
    title: string,
    warnings: string | undefined,
    created_at: number,
    id?: string
}

