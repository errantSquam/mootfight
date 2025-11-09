import { useForm, type SubmitHandler, type UseFormRegister } from "react-hook-form"
import { useRef, useState } from "react"
import { Icon } from "@iconify/react"
import { MarkdownEditor } from "~/components/markdownEditor"
import type { MDXEditorMethods } from "@mdxeditor/editor"

type Inputs = {
    uid: string
}

function checkImage(url: string | undefined) {
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
    return true
}

const ImageUploadComponent = ({ register }: { register: UseFormRegister<Inputs> }) => {

    const [imageLink, setImageLink] = useState<string | undefined>(undefined)
    const [showImage, setShowImage] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<boolean>(false)

    const validateImage = () => {
        if (checkImage(imageLink) === true) {
            setShowImage(true)
            setValidationError(false)
        } else {
            setValidationError(true)
        }

    }

    const resubmitImage = () => {
        setShowImage(false)
        setValidationError(false)
    }

    return <div className="flex flex-col gap-y-2 items-center">
        <div className={`flex flex-col text-center items-center gap-y-2 ${showImage ? 'hidden' : 'visible'}`}>

            <div className="flex flex-col text-center items-center justify-center w-80">

                <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 border-gray-600 bg-zinc-900">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-y-2">
                        <Icon icon="cuida:upload-outline" className="text-5xl text-gray-400" />
                        <p className="text-sm text-gray-400">Input image link:</p>

                        <input className="bg-zinc-400 rounded text-sm text-zinc-900/100 py-1 px-2"
                            placeholder="Your image link here..."
                            value={imageLink}
                            onChange={(e) => { setImageLink(e.target.value) }} />

                        <div onClick={() => { validateImage() }}
                            className="text-sm bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded select-none">
                            Validate
                        </div>
                    </div>
                </div>

            </div>
            {
                validationError &&
                <div className="text-red-300 text-sm">Invalid image. Check your link?
                    <br />
                    <i className="text-red-400/60">
                        (It should end with the file extension, e.g. <u>https://(yourfilehost)/(yourart).png</u>.
                    </i>
                </div>
            }
        </div>
        {
            showImage &&
            <div className={`flex flex-col w-full items-center`}>
                <img src={imageLink} />
                <div className='text-green-300'>Image is valid!</div>

                <div onClick={() => { resubmitImage() }} className="bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded">
                    Resubmit Image
                </div>
            </div>
        }
        <div className={`flex flex-row gap-x-2 ${showImage ? 'visible' : 'hidden'}`}>

        </div>
    </div>

}

export function SubmitCharacterPage() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data, e) => {
        console.log(data)

    }
    const descRef = useRef<MDXEditorMethods>(null)


    return <div className="flex flex-col items-center text-center justify-center pt-5 w-full gap-y-2">
        <h2>Submit Character</h2>
        <div className="flex flex-col gap-y-2">
            <h3>Character Information</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex flex-col items-start col-span-2">
                    <h4>Name</h4>
                    <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full" />
                </div>
                <div className="flex flex-col items-start">
                    <h4>Pronouns <i className="text-zinc-500">(Optional)</i></h4>
                    <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full" />
                </div>
                <div className="flex flex-col items-start">
                    <h4>Status <i className="text-zinc-500">(Optional)</i></h4>
                    <input className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full" />
                </div>
                <div className="flex flex-col items-start col-span-2">
                    <h4>Description</h4>
                    <div className = "text-start w-full">
                        <MarkdownEditor ref={descRef} />
                    </div>
                    <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full" />
                </div>
                <div className="flex flex-col items-start col-span-2">
                    <h4>Character Permissions</h4>
                    <div className = "text-start w-full">
                        <MarkdownEditor ref={descRef} />
                    </div>
                    <input hidden className="border border-zinc-500 rounded-md p-1 bg-zinc-900 w-full" />
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-y-2">
            <h3>Main Image</h3>
            <ImageUploadComponent register={register} />
            <div className="bg-zinc-900 p-3 rounded">This will be your character's main image. <br />You can always go back and change this later, or add more images!</div>

        </div>


    </div>

}