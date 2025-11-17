import { useForm, type FieldErrors, type SubmitHandler, type UseFormRegister, type UseFormSetValue } from "react-hook-form"
import { useRef, useState, type FormEvent } from "react"
import { Icon } from "@iconify/react"
import { MarkdownEditor } from "~/components/markdownEditor"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { useContext } from "react"
import { useFieldArray } from "react-hook-form"
import { AuthContext } from "~/provider/authProvider"
import { handleToast } from "~/functions/handleToast"
import { createCharacter } from "~/api/characterApi"
import { useNavigate } from "react-router"
import { ToastStatus } from "common"
import { Modal } from "~/components/genericComponents"
import { getProfileLink } from "~/functions/helper"
import { MootButton, MootButtonSubmit } from "~/components/button"


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

const ImageUploadComponent = ({ register, errors, setValue, imageIndex }:
    {
        register: UseFormRegister<CharacterSchema>,
        errors: FieldErrors<CharacterSchema>,
        setValue: UseFormSetValue<CharacterSchema>,
        imageIndex: number
    }) => {

    const [imageData, setImageData] = useState<RefImage>({
        imageLink: '',
        artist: undefined,
        artistLink: undefined,
    })
    const [validationVerified, setValidationVerified] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<boolean>(false)

    const [showImage, setShowImage] = useState<boolean>(false)
    const [customCreditEnable, setCustomCredit] = useState<boolean>(false)

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

                        <input className={`${validationError ? "bg-red-300" :
                            validationVerified ? "bg-green-300" : "bg-zinc-400"} 
                        rounded text-sm text-zinc-900/100 py-1 px-2`}
                            placeholder="Your image link here..."
                            value={imageData.imageLink}
                            onChange={(e) => {
                                let updatedData = {
                                    ...imageData,
                                    imageLink: e.target.value
                                }
                                setImageData(updatedData)
                                setValue(`images.${imageIndex}`, updatedData)

                            }}
                            autoComplete="off"
                        />

                        <MootButton onClick={() => { validateImage(imageData.imageLink) }}
                            >
                            Validate
                        </MootButton>

                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center justify-center gap-x-2 italic">
                <input type="checkbox"
                    checked={customCreditEnable}
                    onChange={(e) => { 
                        setCustomCredit(e.target.checked) 
                        if (e.target.checked === false) {
                            let nulledData = {...imageData,
                                artist: undefined,
                                artistLink: undefined
                            }
                            setImageData(nulledData)
                            setValue(`images.${imageIndex}`, nulledData)

                        }
                        }} />
                <div>Custom artist credit</div>
            </div>

            {
                customCreditEnable &&
                <div className="flex flex-col items-start">
                    <div className="flex flex-row items-center justify-center gap-x-2 italic">
                        <div>Artist Name</div>
                        <input type="text"
                            className="bg-zinc-400 rounded text-xs text-zinc-900/100 px-2"
                            checked={customCreditEnable}
                            onChange={(e) => {
                                let updatedData = {
                                    ...imageData,
                                    artist: e.target.value
                                }
                                setImageData(updatedData)
                                setValue(`images.${imageIndex}`, updatedData)
                            }} />
                    </div>
                    <div className="flex flex-row items-center justify-center gap-x-2 italic">
                        <div>Artist Link</div>
                        <input type="text"
                            className="bg-zinc-400 rounded text-xs text-zinc-900/100 px-2"
                            checked={customCreditEnable}
                            onChange={(e) => {
                                let updatedData = {
                                    ...imageData,
                                    artistLink: e.target.value
                                }
                                setImageData(updatedData)
                                setValue(`images.${imageIndex}`, updatedData)
                            }} />
                    </div>
                </div>
            }
        </div>
        {
            //Summon a modal instead...
            <Modal isOpen={showImage} handleClose={handleModalClose} title="Image Verification">
                <div className={`flex flex-col items-center gap-y-2`}>
                    <img src={imageData.imageLink} className="w-1/3" />
                    <div className='text-green-300'>Image is valid!</div>


                    <MootButton
                        onClick={() => { handleModalClose() }}>
                        Close
                    </MootButton>
                </div>
            </Modal>

        }
        <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
            value={imageData.imageLink}
            {...register(`images.${imageIndex}`,
                {
                    required: true,
                    validate: (value) => {
                        //Return false means a-ok in hook forms... why
                        if (!checkImage(value.imageLink)) { return true }

                    },
                }
            )}

        />
    </div>

}

export function SubmitCharacterPage() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        unregister,
        formState: { errors },
    } = useForm<CharacterSchema>()



    const descRef = useRef<MDXEditorMethods>(null)
    const permsRef = useRef<MDXEditorMethods>(null)
    const [imagesIndex, setImagesIndex] = useState(0)
    const { userInfo, refreshAuthUser, authLoaded } = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)

    let navigate = useNavigate()

    const handleDeleteImage = () => {

        if (imagesIndex === 0) {
            return
        }
        unregister(`images.${imagesIndex}`, { keepValue: false })
        setImagesIndex(imagesIndex - 1)
    }

    const handleAddImage = () => {
        setImagesIndex(imagesIndex + 1)
    }

    const onSubmit: SubmitHandler<CharacterSchema> = (data, e) => {
        setIsLoading(true)

        data.description = descRef.current?.getMarkdown()
        data.permissions = permsRef.current?.getMarkdown()
        data.owner = userInfo?.uid //can be null

        //throw error if auth not loaded? somehow?

        //Map artist to self if unset
        data.images = data.images.map((image) => {
            let tempImage = {...image}
            if (image.artist === undefined) {
                tempImage.artist = userInfo?.username
            }
            if (image.artistLink === undefined) {
                tempImage.artistLink = `/user/profile/${userInfo?.username}/${userInfo?.uid}`
            }
            return tempImage
        })

        console.log("Data:")
        console.log(data)

        createCharacter(data).then((resp) => {
            handleToast(resp)
            if (resp.toastType === ToastStatus.SUCCESS) {
                navigate(getProfileLink(userInfo?.username, userInfo?.uid))

            }
        })

        setIsLoading(false)

    }


    return <div className="flex flex-col items-center text-center justify-center pt-5 w-full gap-y-2">
        <h2>Submit Character</h2>
        <form className="flex flex-col items-center max-w-2/3 gap-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2">
                <h3>Character Information</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex flex-col items-start col-span-2">
                        <h4>Name</h4>
                        <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                            {...register("name", { required: true })} />
                        {errors.name && <div className="text-red-400">This field is required</div>}
                    </div>
                    <div className="flex flex-col items-start col-span-2 md:col-span-1">
                        <h4>Pronouns <i className="text-zinc-500">(Optional)</i></h4>
                        <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                            {...register("pronouns")} />
                    </div>
                    <div className="flex flex-col items-start col-span-2 md:col-span-1">
                        <h4>Status <i className="text-zinc-500">(Optional)</i></h4>
                        <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                            {...register("status")} />
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
                    <div className="flex flex-col items-start col-span-2">
                        <h4>Character Permissions</h4>
                        <div className="text-start w-full">
                            <MarkdownEditor ref={permsRef} />
                        </div>
                        <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full"
                            {...register("description")}
                            value={permsRef.current?.getMarkdown()} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center text-center gap-y-2 md:w-2/3">
                <h3>Upload Images</h3>


                {[...Array(imagesIndex + 1).keys()].map((index) => {
                    return <ImageUploadComponent register={register} errors={errors} setValue={setValue}
                        imageIndex={index} />
                })}




                <div className={`flex flex-row items-center w-full md:w-120 space-x-2`}>
                    <div className={`flex flex-row w-full items-center justify-center text-center 
                rounded-lg p-2 text-zinc-400 font-bold bg-zinc-900 gap-x-1
                hover:bg-zinc-700 select-none cursor-pointer`}
                        onClick={() => { handleAddImage() }}>
                        <Icon icon="mingcute:plus-fill" className="text-xl" />
                        <div>Add <span className = "hidden md:inline">Image</span></div>
                    </div>
                    {
                        //if more than one image show this
                        imagesIndex > 0 &&
                        <div className={`flex flex-row w-full items-center justify-center text-center 
                rounded-lg p-2 text-zinc-400 font-bold bg-zinc-900 gap-x-1
                hover:bg-zinc-700 select-none cursor-pointer`}

                            onClick={() => { handleDeleteImage() }}>
                            <Icon icon="mingcute:plus-fill" className="text-xl" />
                            <div>Remove <span className = "hidden md:inline">Image</span></div>
                        </div>
                    }
                </div>

            </div>
            <MootButtonSubmit/>
        </form>


    </div>

}