interface UserSchema {
    username:string,
    profile_picture?:string,
    pronouns?:string,
    status?:string,
    user_id:string,
    bio?:string,
    permissions?: string

}

interface UserAmbiguousSchema extends UserSchema {
    username?:string,
    user_id?:string
}

interface BioUserSchema extends UserSchema {
    bio: string
}


type ToastResponse = {
    toastType: ToastStatus,
    message: string,
    data?: any
}


type RefImage = {
    imageLink: string,
    artist?: string,
    artistLink?: string
}

interface CharacterSchema {
    name: string,
    pronouns?: string,
    status?: string,
    description?: string,
    permissions?: string,
    images: RefImage[],
    owner: string
    character_id?: string
}


type AttackSchema = {
    image: string,
    description: string | undefined,
    attacker: string,
    defenders: string[],
    characters: string[],
    title: string,
    warnings: string | undefined,
    created_at: number,
    attack_id?: string
}

