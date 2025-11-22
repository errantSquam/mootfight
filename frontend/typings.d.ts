interface UserSchema {
    username:string,
    profile_picture?:string,
    pronouns?:string,
    status?:string,
    id:string,
    bio?:string,
    permissions?: string

}

interface UserAmbiguousSchema extends UserRecord {
    username?:string,
    id?:string,
    characters?: CharacterSchema[]
    collectionId?: string,
    collectionName?: string,
    created?: string,
    updated?: string,
    email?: string,
    emailVisibility?: boolean,
    verified?: boolean,
    expand?: any,
    
    attacks?: AttackSchema[],
    
    defences?: AttackSchema[],
}

interface UserRecord extends UserSchema {
    collectionId: string,
    collectionName: string,
    created: string,
    updated: string,
    email: string,
    emailVisibility: boolean,
    verified: boolean,
    expand: any
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
    id?: string
    image_link: string,
    artist_name?: string,
    artist_link?: string,
    uploader?: string
}



interface CharacterRecord {
    name: string,
    pronouns?: string,
    status?: string,
    description?: string,
    permissions?: string,
    images?: RefImage[],
    owner: string
    id?: string
}

interface CharacterSchema extends CharacterRecord {
    images: RefImage[],
    attacks?: AttackSchema[],
    
    
    owner: UserAmbiguousSchema
}

interface CharacterAmbiguousSchema extends CharacterSchema {
    expand?: any
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

