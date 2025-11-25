import { useForm, type FieldErrors, type SubmitHandler, type UseFormRegister, type UseFormSetValue } from "react-hook-form"
import { useRef, useState, type FormEvent } from "react"
import { Icon } from "@iconify/react"
import { MarkdownEditor } from "~/components/markdownEditor"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { useContext } from "react"
import { AuthContext } from "~/provider/authProvider"
import { handleToast } from "~/functions/handleToast"
import { createCharacter, getCharactersBySearch, getCharactersBySearchQueries, getCharactersOwners } from "~/api/characterApi"
import { Link, useNavigate } from "react-router"
import { ToastStatus } from "common"
import { Modal } from "~/components/genericComponents"
import { getCharacter } from "~/api/characterApi"
import { checkCharacterExists } from "~/api/characterApi"
import { toast } from "react-toastify/unstyled"
import { createAttack } from "~/api/attackApi"
import { MootButton, MootButtonSubmit } from "~/components/button"
import { ImageWithLoader } from "~/components/loaders"



async function checkImage(url: string | undefined) {
    //console.log(url)
    if (url === undefined || url === "") {
        return false
    }
    var image = new Image();
    image.onload = function () {
        if (image.width > 0) {
            return true
        }
    }
    image.onerror = function () {
        return false
    }
    image.src = url;

    await image.decode()

    if (image.width > 0) {
        return true
    } else {
        console.log("Width error")
        return false
    }
}

const ImageUploadComponent = ({ register, errors, setValue }:
    {
        register: UseFormRegister<any>,
        errors: FieldErrors<any>,
        setValue: UseFormSetValue<any>,
    }) => {

    const [imageData, setImageData] = useState<string>('')
    const [validationVerified, setValidationVerified] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<boolean>(false)

    const [showImage, setShowImage] = useState<boolean>(false)

    const validateImage = async (image_link: string) => {
        //change to a handler?
        let resp = await checkImage(image_link)
        if (resp === true) {
            setValidationVerified(true)
            setValidationError(false)
            setShowImage(true)
        } else {
            console.log("True")
            setValidationError(true)
        }

    }

    const resubmitImage = () => {
        setValidationVerified(false)
        setValidationError(false)
    }

    const handleModalClose = () => {
        setShowImage(false)
    }

    return <div className="flex flex-col items-center bg-zinc-900 p-2 px-4 rounded">
        <div className={`flex flex-col items-start gap-y-1 text-sm`}>

            <div className="flex flex-row text-center items-center justify-center">

                <div className="flex flex-row">
                    <div className="flex flex-row items-center justify-center gap-x-2">

                        <input className={`${validationError ? "bg-red-300" :
                            validationVerified ? "bg-green-300" : "bg-zinc-400"} 
                        rounded text-sm text-zinc-900/100 py-1 px-2`}
                            placeholder="Your image link here..."
                            value={imageData}
                            onChange={(e) => {
                                setImageData(e.target.value)
                                setValue(`image_link`, e.target.value)

                            }}
                            autoComplete="off"
                        />

                        <MootButton onClick={() => { validateImage(imageData) }}>
                            Validate
                        </MootButton>

                    </div>
                </div>
            </div>
        </div>
        {
            //Summon a modal instead...
            <Modal isOpen={showImage} handleClose={handleModalClose} title="Image Verification">
                <div className={`flex flex-col items-center gap-y-2`}>
                    <img src={imageData} className="w-1/3" />
                    <div className='text-green-300'>Image is valid!</div>


                    <MootButton
                        onClick={() => { handleModalClose() }}>
                        Close
                    </MootButton>
                </div>
            </Modal>

        }
        <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
            value={imageData}
            {...register(`image_link`,
                {
                    required: true,
                    validate: (value) => {
                        //Return false means a-ok in hook forms... why
                        if (!checkImage(value)) { return true }

                    },
                }
            )}

        />
    </div>

}

async function isCharacterValid(character_id: string) {
    let resp = await checkCharacterExists(character_id)
    return resp

}

const CharacterUploadComponent = ({ register, index, setValue }:
    {
        register: UseFormRegister<AttackSchema>,
        index: number,
        setValue: UseFormSetValue<any>,
    }
) => {

    const [isValidated, setValidated] = useState<boolean>(false)

    const [validatedValue, setValidatedValue] = useState({
        user: '',
        character: ''
    })
    const [inputValue, setInputValue] = useState<string>('')

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchModalOpen, setSearchModal] = useState<boolean>(false)

    const [searchQuery, setSearchQuery] = useState<any>({
        user: '',
        character: ''
    })
    const [searchResults, setSearchResults] = useState<CharacterAmbiguousSchema[]>([])



    const handleValidate = async () => {
        setIsLoading(true)
        console.log("Handle validate:")
        console.log(inputValue)
        let characterValidity = await isCharacterValid(inputValue)
        if (characterValidity) {
            let resp = await getCharacter(inputValue)
            console.log(resp)
            let userResp = resp?.owner

            let tempValue = {
                user: userResp?.username || '',
                character: resp?.name || '',
            }

            console.log(tempValue)


            setValidated(true)
            setValidatedValue(tempValue)
        }

        setIsLoading(false)

        return characterValidity
    }

    const handleResubmit = () => {
        setValidated(false)
    }

    return <div className="w-full flex flex-row items-center gap-x-2">
        <input className={`${isValidated ? "visible" : "hidden"} w-full border border-zinc-500 rounded-md p-1 
        text-green-300`}
            defaultValue={`${validatedValue.user}'s ${validatedValue.character}`}
            disabled
            key={validatedValue.user + validatedValue.character}
        />

        <Modal
            isOpen={searchModalOpen}
            handleClose={() => setSearchModal(false)}
            title=""
        >
            <div className="flex flex-col w-full items-center gap-y-2">
                <h3> Search</h3>
                <div className="flex flex-row gap-x-2">
                    <div className="flex flex-col gap-y-2 items-center justify-center">
                        <span>Username</span>
                        <input type="text" className="py-1 px-2 w-2/3 border border-zinc-500"
                            placeholder="Username"
                            value={searchQuery.user}
                            onChange={(e) => {
                                setSearchQuery({ ...searchQuery, user: e.target.value })
                            }} />
                    </div>
                    <div className="flex flex-col gap-y-2 items-center justify-center">
                        <span>Character</span>
                        <input type="text" className="py-1 px-2 w-2/3 border border-zinc-500"
                            placeholder="Character"
                            value={searchQuery.character}
                            onChange={(e) => {
                                setSearchQuery({ ...searchQuery, character: e.target.value })
                            }} />
                    </div>
                </div>
                <div className="flex flex-row w-1/2 px-8 py-4 justify-center space-x-4">

                    <MootButton onClick={() => {
                        getCharactersBySearchQueries(searchQuery, 1, 99).then((resp) => {
                            setSearchResults(resp.items)
                        })
                    }}>
                        Submit
                    </MootButton>
                </div>

                <div className="flex flex-row flex-wrap gap-x-2 p-2 w-full border-2 border-zinc-500 h-50 overflow-y-scroll">
                    {searchResults.map((chara) => {
                        return <div className="flex flex-col text-center items-center cursor-pointer" key={chara.id}
                            onClick={() => {
                                setInputValue(chara.id!)
                                setValue(`characters.${index}`,chara.id)
                                setSearchModal(false)

                            }}>
                            <ImageWithLoader src={chara.images[0].image_link} className="w-20 h-20 object-cover" />
                            <span className="w-20 text-ellipsis overflow-hidden">{chara.name}</span>
                        </div>
                    })}
                </div>
            </div>

        </Modal>

        <input className={`${isValidated ? "hidden" : "visible"} w-full border border-zinc-500 rounded-md p-1 bg-zinc-900`}
            {...register(`characters.${index}`, { required: true })}
            onChange={(e) => { setInputValue(e.target.value) }}
            value={inputValue}
        />


        {!isValidated ?
            <div className="flex flex-row gap-x-2">
                <MootButton onClick={() => { setSearchModal(true) }}
                    className="text-sm">
                    Search
                </MootButton>
                <MootButton onClick={() => { handleValidate() }}
                    className="text-sm">
                    {isLoading ? <Icon icon="eos-icons:loading" className="text-lg" /> : <span>Validate</span>}
                </MootButton>
            </div> :
            <MootButton onClick={() => { handleResubmit() }}
                className="text-sm"
            >
                Resubmit
            </MootButton>
        }
    </div>
}


export function SubmitAttackPage() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        getValues,
        unregister,
        formState: { errors },
    } = useForm<AttackSchema>()



    const descRef = useRef<MDXEditorMethods>(null)
    const { userInfo, refreshAuthUser, authLoaded } = useContext(AuthContext)

    const [enableWarnings, setEnableWarnings] = useState<boolean>(false)
    let navigate = useNavigate()

    const [charactersIndex, setCharactersIndex] = useState<number>(0)

    const [isLoading, setIsLoading] = useState(false)

    const handleDeleteCharacter = () => {

        if (charactersIndex === 0) {
            return
        }
        unregister(`characters.${charactersIndex}`, { keepValue: false })
        setCharactersIndex(charactersIndex - 1)
    }

    const handleAddCharacter = () => {
        setCharactersIndex(charactersIndex + 1)
    }


    const onSubmit: SubmitHandler<AttackSchema> = async (data, e) => {

        // Iterate through characters to get list of defenders

        setIsLoading(true)
        console.log(data)


        if (userInfo === null) {
            handleToast({
                toast_type: "error",
                message: "Maybe you're not logged in?"
            })
            return
        }

        let owners = await getCharactersOwners(data.characters)
        let filteredArray = owners.filter((id) => {
            return id === userInfo.id
        })

        if (filteredArray.length === owners.length) {
            console.log("toast should fire")
            handleToast({
                toast_type: "error",
                message: "Attack must contain at least one character from a different user!"
            })
            setIsLoading(false)
            return
        }

        //now filter yourself out
        data.defenders = owners.filter((id) => {
            return id !== userInfo.id
        })

        data.description = descRef.current?.getMarkdown()
        data.attacker = userInfo.id as string

        //check for empty
        if (!data.warnings) {
            data.warnings = undefined
        }
        if (enableWarnings === false) {
            data.warnings = undefined
        }

        if (data.warnings === undefined) {
            delete data.warnings

        }

        setIsLoading(false)

        console.log("Data:")
        console.log(data)

        //API call goes here.

        createAttack(data).then((resp) => {
            handleToast(resp)
            navigate(`/attack/${resp.data}`)
        })
    }


    return <div className="flex flex-col items-center text-center justify-center pt-5 w-full gap-y-2">
        <h2>Submit Attack</h2>
        <form className="flex flex-col items-center max-w-2/3 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center text-center gap-y-2 w-2/3">
                <h3>Upload Image</h3>

                <ImageUploadComponent register={register} errors={errors} setValue={setValue} />
                {errors.image_link && <div className="text-red-400">This field is required.</div>}

            </div>
            <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                    <div className="flex flex-col items-start col-span-2 gap-y-2">
                        <h4>Character(s)</h4>
                        <div className="flex flex-col w-full gap-y-2">
                            {[...Array(charactersIndex + 1).keys()].map((index) => {
                                return <CharacterUploadComponent register={register} index={index} setValue = {setValue}/>
                            })}

                        </div>
                        <div className="flex flex-row w-full gap-x-2">
                            <div className={`flex flex-row w-full items-center justify-center text-center 
                            rounded-lg p-1 text-zinc-400 font-bold bg-zinc-900 gap-x-1
                            hover:bg-zinc-700 select-none cursor-pointer`}
                                onClick={() => { handleAddCharacter() }}>
                                <Icon icon="mingcute:plus-fill" className="text-xl" />
                                <div>Add Character</div>
                            </div>
                            {charactersIndex > 0 &&
                                <div className={`flex flex-row w-full items-center justify-center text-center 
                                    rounded-lg p-1 text-zinc-400 font-bold bg-zinc-900 gap-x-1
                                    hover:bg-zinc-700 select-none cursor-pointer`}
                                    onClick={() => { handleDeleteCharacter() }}>
                                    <Icon icon="mingcute:plus-fill" className="text-xl" />
                                    <div>Remove Character</div>
                                </div>
                            }
                        </div>
                        {errors.characters && <div className="text-red-400">Characters field is required
                            {getValues("characters")}</div>}

                    </div>
                    <div className="flex flex-col items-start col-span-2">
                        <h4>Title</h4>
                        <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                            {...register("title", { required: true })} />
                        {errors.title && <div className="text-red-400">This field is required</div>}
                    </div>
                    <div className="flex flex-col items-start col-span-2">
                        <h4>Description</h4>
                        <div className="text-start w-full">
                            <MarkdownEditor ref={descRef} />
                        </div>
                        <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                            {...register("description")}
                            value={descRef.current?.getMarkdown()} />
                    </div>
                    <div className="flex flex-col items-start col-span-2 gap-y-2">

                        <h4>Content Warnings</h4>
                        <div className="flex flex-row items-center justify-center gap-x-2 italic">
                            <input type="checkbox"
                                checked={enableWarnings}
                                onChange={(e) => {
                                    setEnableWarnings(e.target.checked)

                                }} />
                            <div
                                className="select-none" onClick={(e) => {
                                    setEnableWarnings(!enableWarnings)
                                }}
                            >Enable custom warnings</div>
                        </div>
                        {enableWarnings &&
                            <div className="flex flex-row gap-x-2 w-full">
                                <div className="text-sm text-red-300">Input warning(s)</div>
                                <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                                    {...register("warnings")} />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <MootButtonSubmit />
        </form>


    </div>

}