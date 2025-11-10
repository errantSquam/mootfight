
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useState, type JSX } from "react";
import { useParams } from "react-router";
import { getCharacterHook } from "~/api/characterApi";
import { ImageWithLoader, ImageSkeletonComponent } from "~/components/loaders";


export default function CharacterPage() {
    let params = useParams()

    const [charaTab, setCharaTab] = useState("Gallery")

    const [charaData, charaLoading, charaError] = getCharacterHook(params.characterId)

    const handleCharacterData = (charaData: boolean | DocumentSnapshot<DocumentData, DocumentData> | null | undefined) => {
        if (typeof charaData === "boolean" || charaData == null) {
            return {}
        } else {
            let tempData = charaData.data() || {}
            tempData.cid = charaData.id
            console.log(tempData)
            console.log(tempData.images[0])
            return tempData
        }

    }



    const CharaTabs: { [index: string]: JSX.Element } = {
        "Gallery": <div></div>,
        "Description": <div>{handleCharacterData(charaData)?.description}</div>,
        "Battles": <div></div>, //attacks/defences
        "Stats": <div></div>
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
                        {charaLoading ? <ImageSkeletonComponent className="w-20 h-20 object-cover" /> :
                            <ImageWithLoader src={handleCharacterData(charaData).images[0].imageLink}
                                className="w-20 h-20 object-cover" />
                        }
                    </div>
                    <div className="flex flex-col space-y-2 w-full grow">
                        <div className="flex flex-col grow items-start">
                            {!charaLoading &&
                                <div className="flex flex-row gap-x-2 items-center justify-center">
                                    <div className="text-xl font-bold">
                                        {handleCharacterData(charaData).name}
                                    </div>
                                    <i className="opacity-70">({handleCharacterData(charaData).cid})</i>
                                </div>
                            }
                            <div>{handleCharacterData(charaData)?.pronouns &&
                                <div className="">{handleCharacterData(charaData)?.pronouns}</div>}
                            </div>
                            <div className="opacity-70 text-sm"><i>{handleCharacterData(charaData)?.status}</i></div>
                        </div>
                        <div className="flex flex-col grow items-start">
                            <div className="flex flex-row gap-x-2">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row">
                <div className="flex flex-row w-fit">
                    {Object.keys(CharaTabs).map((tabKey: string) => {
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