export function getPfp(src: string | undefined) {
    return src === undefined ? "/assets/images/default owlcroraptor.png" : src

}

export function getProfileLink(username: string, uid?: string) {
    
    let link = '/user/profile/' + encodeURIComponent(username) 
    if (uid !== undefined) {
        link += '/' + uid;
    }
    return link
}