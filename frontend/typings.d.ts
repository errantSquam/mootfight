interface UserSchema {
    username:string,
    profilePicture?:string,
    pronouns?:string,
    status?:string,
    uid:string,
    bio?:string,
    permissions?: string

}

interface UserAmbiguousSchema extends UserSchema {
    username?:string,
    uid?:string
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
    cid?: string
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

