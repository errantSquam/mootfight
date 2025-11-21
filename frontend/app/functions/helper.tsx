export function getPfp(src: string | undefined) {
    return src === undefined || src === '' ? "/assets/images/default owlcroraptor.png" : src

}

export function getProfileLink(username: string, user_id?: string) {
    
    let link = '/user/profile/' + encodeURIComponent(username) 
    if (user_id !== undefined) {
        link += '/' + user_id;
    }
    return link
}