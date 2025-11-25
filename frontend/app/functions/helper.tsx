import { pb } from "~/api/pocketbase"

export function getPfp(id: string | undefined, src: string | undefined) {

    if (src === undefined || id === undefined) {
        return "/assets/images/default owlcroraptor.png"
    }
    

    let pfp = `${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/users/${id}/${src}`
    //console.log(pfp)

    return src === undefined || src === '' ? "/assets/images/default owlcroraptor.png" : pfp

}

export function getProfileLink(username: string) {
    
    let link = '/user/profile/' + encodeURIComponent(username) 
    return link
}