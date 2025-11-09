interface UserSchema {
    username:string,
    email:string,
    profilePicture?:string,
    pronouns?:string,
    status?:string,
    uid:string,
    bio?:string

}

interface UserAmbiguousSchema extends UserSchema {
    username?:string,
    email?: string,
    uid?:string
}

interface BioUserSchema extends UserSchema {
    bio: string
}


type ToastResponse = {
    toastType: string,
    message: string,
    data?: any
}


type RefImage = {
    imageLink: string,
    artist?: string,
    artistLink?: string
}

type CharacterSchema = {
    name: string,
    pronouns?: string,
    status?: string,
    description?: string,
    permissions?: string,
    images: RefImage[],
    owner: string
}