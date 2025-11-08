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