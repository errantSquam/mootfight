export function getPfp(src: string | undefined) {
    return src === undefined || src === '' ? "/assets/images/default owlcroraptor.png" : src

}

export function getProfileLink(username: string) {
    
    let link = '/user/profile/' + encodeURIComponent(username) 
    return link
}