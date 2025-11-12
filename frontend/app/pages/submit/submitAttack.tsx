import { useForm, type FieldErrors, type SubmitHandler, type UseFormRegister, type UseFormSetValue } from "react-hook-form"
import { useRef, useState, type FormEvent } from "react"
import { Icon } from "@iconify/react"
import { MarkdownEditor } from "~/components/markdownEditor"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { useContext } from "react"
import { useFieldArray } from "react-hook-form"
import { AuthContext } from "~/provider/authProvider"
import { handleToast } from "~/functions/handleToast"
import { createCharacter, getCharactersOwners } from "~/api/characterApi"
import { useNavigate } from "react-router"
import { ToastStatus } from "common"
import { Modal } from "~/components/genericComponents"
import { getCharacter } from "~/api/characterApi"
import { getCharacterHook } from "~/api/characterApi"
import { checkCharacterExists } from "~/api/characterApi"
import { getUserInfo } from "~/api/userApi"
import { toast } from "react-toastify/unstyled"
import { createAttack } from "~/api/attackApi"



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

    const validateImage = async (imageLink: string) => {
        //change to a handler?
        let resp = await checkImage(imageLink)
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
                        <p className="text-sm">Input image link:</p>

                        <input className={`${validationError ? "bg-red-300" :
                            validationVerified ? "bg-green-300" : "bg-zinc-400"} 
                        rounded text-sm text-zinc-900/100 py-1 px-2`}
                            placeholder="Your image link here..."
                            value={imageData}
                            onChange={(e) => {
                                setImageData(e.target.value)
                                setValue(`image`, e.target.value)

                            }}
                            autoComplete="off"
                        />

                        <div onClick={() => { validateImage(imageData) }}
                            className="text-sm bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded select-none">
                            Validate
                        </div>

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


                    <div className="flex bg-zinc-800 hover:bg-zinc-700 cursor-pointer select-none rounded p-2"
                        onClick={() => { handleModalClose() }}>
                        Close
                    </div>
                </div>
            </Modal>

        }
        <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
            value={imageData}
            {...register(`image`,
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

async function isCharacterValid(cid: string) {
    let resp = await checkCharacterExists(cid)
    return resp

}

const CharacterUploadComponent = ({ register, index }:
    {
        register: UseFormRegister<AttackSchema>,
        index: number
    }
) => {

    const [isValidated, setValidated] = useState<boolean>(false)

    const [validatedValue, setValidatedValue] = useState({
        user: '',
        character: ''
    })
    const [inputValue, setInputValue] = useState<string>('')

    const [isLoading, setIsLoading] = useState<boolean>(false)



    const handleValidate = async () => {
        setIsLoading(true)
        console.log(inputValue)
        let characterValidity = await isCharacterValid(inputValue)
        if (characterValidity) {
            let resp = await getCharacter(inputValue)
            let userResp = await getUserInfo(resp?.owner || '')

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
        />

        <input className={`${isValidated ? "hidden" : "visible"} w-full border border-zinc-500 rounded-md p-1 bg-zinc-900`}
            {...register(`characters.${index}`, { required: true })}
            onChange={(e) => { setInputValue(e.target.value) }}
            value = {inputValue}
        />


        {!isValidated ?
            <div className="flex flex-row gap-x-2">
                <div onClick={() => { /*search*/ }}
                    className="text-sm bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded select-none">
                    Search
                </div>
                <div onClick={() => { handleValidate() }}
                    className="text-sm bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded select-none">
                    {isLoading ? <Icon icon="eos-icons:loading" className = "text-lg"/> : <span>Validate</span>}
                </div>
            </div> :
            <div onClick={() => { handleResubmit() }}
                className="text-sm bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded select-none">
                Resubmit
            </div>
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
        let owners = await getCharactersOwners(data.characters)
        let filteredArray = owners.filter((id) => {
            return id === userInfo.uid
        })

        if (filteredArray.length === owners.length) {
            console.log("toast should fire")
            handleToast({
                toastType:"error",
                message:"Attack must contain at least one character from a different user!"
            })
            setIsLoading(false)
            return
        } 

        //now filter yourself out
        data.defenders = owners.filter((id) => {
            return id !== userInfo.uid
        })

        data.description = descRef.current?.getMarkdown()
        data.attacker = userInfo.uid //can be null

        data.creationDate = Date.now()

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
        })
    }


    return <div className="flex flex-col items-center text-center justify-center pt-5 w-full gap-y-2">
        <h2>Submit Attack</h2>
        <form className="flex flex-col items-center max-w-2/3 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center text-center gap-y-2 w-2/3">
                <h3>Upload Image</h3>

                <ImageUploadComponent register={register} errors={errors} setValue={setValue} />
                {errors.image && <div className="text-red-400">This field is required.</div>}

            </div>
            <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">

                    <div className="flex flex-col items-start col-span-2 gap-y-2">
                        <h4>Character(s)</h4>
                        <div className="flex flex-col w-full gap-y-2">
                            {[...Array(charactersIndex + 1).keys()].map((index) => {
                                return <CharacterUploadComponent register={register} index={index} />
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
                        {errors.characters && <div className="text-red-400">Characters field is required</div>}

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

            <input type="submit" value="Submit"
                className="w-full bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded" />
        </form>


    </div>

}