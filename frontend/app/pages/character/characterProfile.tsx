
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useState, type JSX } from "react";
import { useParams } from "react-router";
import { getCharacterHook } from "~/api/characterApi";
import { ImageWithLoader, ImageSkeletonComponent } from "~/components/loaders";
import { SanitizedMarkdown } from "~/components/profile/sanitizedMarkdown";
import { getUserInfoHook } from "~/api/userApi";
import { Link } from "react-router";
import { getArtistLink, getProfileLink } from "~/functions/helper";
import { MootButton } from "~/components/button";
import { pb } from "~/api/pocketbase";

const generateExport = (data: any, filename: string = 'export') => {

    const currentVersion = "0.0.1"

    const a = document.createElement("a");

    delete data.owner
    delete data.collectionName 
    delete data.collectionId

    data.images = data.images.map((image: any) => {
        delete image.collectionId
        delete image.collectionName
        delete image.uploader
        return image
    })
    data.version = currentVersion 

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "json" });
    const url = URL.createObjectURL(blob);
    a.setAttribute("href", url);
    a.setAttribute("download", `${filename}.json`);
    a.click();
}

export default function CharacterPage() {
    let params = useParams()

    const [charaTab, setCharaTab] = useState("Gallery")

    const [charaData, charaLoading, charaError] = getCharacterHook(params.characterId)



    const CharaTabs: { [index: string]: JSX.Element } = {
        "Gallery": <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2">
            {!charaLoading &&
                charaData?.images.map((image: RefImage) => {
                    return <div className="flex flex-col gap-y-2 items-center">
                        <ImageWithLoader src={image.image_link} className="w-40 h-40 object-cover" />
                        <div> by <a href={getArtistLink(image.artist_link || '')} className="mootfight-link"
                            target="_blank" rel="noopener noreferrer">
                            {image.artist_name}
                        </a></div>
                    </div>
                })
            }
        </div>,
        "Description": <div>
            <div><h3>Description</h3>
                <SanitizedMarkdown markdown={charaData?.description || ''} />
            </div>
        </div>,
        "Permissions": <div>
            <h3> Permissions</h3>
            <SanitizedMarkdown markdown={charaData?.permissions || ''} />
        </div>,
        "Battles": <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2">{
            charaData?.attacks?.map((attack) => {
                return <Link to={`/attack/${attack.id}`} className="flex flex-col items-center">
                    <ImageWithLoader src={attack.image_link} className="w-40 h-40 object-cover"
                        spoiler={attack?.warnings} />
                    <div className="w-40 text-center text-ellipsis overflow-hidden">{attack.title}</div>

                </Link>
            })}</div>, //attacks/defences
        "Stats": <div></div>,
        "Settings": <div className="flex flex-col gap-y-2">
            <MootButton onClick={() => generateExport(charaData, `${charaData?.name}_${charaData?.id}_export`)}> Export Character Data</MootButton>
            <MootButton> Import Character Data</MootButton>
        </div>
    }

    //params.characterId

    return <div className="w-full h-full flex flex-col sm:flex-row">
        <div className="w-full h-screen bg-gray-500 flex-1 text-center text-gray-400">
            Featured Character WIP
        </div>
        <div className="w-full h-full flex flex-col items-start gap-y-2 flex-3 px-4">
            <div className="flex flex-col items-start justify-center w-full">
                <div className="flex flex-row items-center gap-x-2 w-full">
                    <div className="p-2">
                        {charaLoading ? <ImageSkeletonComponent className="min-w-20 min-h-20 object-cover" /> :
                            <ImageWithLoader src={charaData?.images[0].image_link || ''}
                                className="w-20 h-20 object-cover" />
                        }
                    </div>
                    <div className="flex flex-col space-y-2 w-full grow">
                        <div className="flex flex-col grow items-start">
                            {!charaLoading &&
                                <div className="flex flex-row gap-x-2 items-center justify-center">
                                    <div className="text-xl font-bold">
                                        {charaData?.name}
                                    </div>
                                    <i className="opacity-70">({charaData?.id})</i>
                                </div>
                            }
                            <div>
                                <div className="">{charaData?.pronouns}</div>
                            </div>
                            <div className="opacity-70 text-sm"><i>{charaData?.status}</i></div>
                        </div>
                    </div>
                </div>
            </div>
            <div> {!charaLoading &&
                <div>
                    Belongs to <Link to={getProfileLink(charaData?.owner?.username || '')}>
                        <u>{charaData?.owner?.username}</u></Link>
                </div>
            }</div>
            <div className="w-full flex flex-row">
                <div className="flex flex-row w-fit">
                    {Object.keys(CharaTabs).filter((tab) => {
                        if (tab === "Settings") {
                            return pb.authStore.record?.id === charaData?.owner?.id
                        } else {
                            return true
                        }
                    }).map((tabKey: string) => {
                        return <div onClick={() => { setCharaTab(tabKey) }} className={`py-1 px-4 transition select-none cursor-pointer border-b-2  
                        ${charaTab === tabKey ? "border-b-white font-bold" : "border-slate-500"}`} key={tabKey}>
                            {tabKey}
                        </div>

                    })}
                </div>
                <div className="flex border-b-2 border-b-slate-500 w-full">

                </div>
            </div>
            <div className="w-2/3 space-y-6 px-4">
                <div className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                    {CharaTabs[charaTab]}
                </div>
            </div></div>
    </div>
}