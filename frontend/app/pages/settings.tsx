import { useForm, type SubmitHandler } from "react-hook-form"
import { type UseFormRegister } from "react-hook-form"
import { toast } from "react-toastify"
import { signIn } from "~/api/firebase"
import { useNavigate } from "react-router"
import { useState } from "react"
import { handleToast } from "~/functions/handleToast"
import { useContext } from "react"
import { AuthContext } from "~/provider/authProvider"
import { updateUserInfo } from "~/api/firebase"
import { Icon } from "@iconify/react"
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useRef } from "react";
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import getCroppedImg from "~/functions/crop"


type Inputs = {
    username: string
    email: string
    pronouns: string
    status: string
}

type ImageInput = {
    profilePicture: any //figure out the image type later...sorry i'm baby at typescript :baby:
}

//todo: refactor these into their own folder
const SettingsInput = ({ defaultValue, value, register, isPassword = false, disabled = false, required = false }:
    { defaultValue: any, value: any, register: UseFormRegister<Inputs>, isPassword?: boolean, disabled?: boolean, required?: boolean }) => {
    return <input className={`disabled:bg-gray-800/0 
                                        disabled:border-white/0
                                        border border-white rounded-md p-1 bg-gray-800 transition`}
        defaultValue={defaultValue}
        placeholder="Unset"
        disabled={disabled}
        {...register(value, { required: required })}

    />
}

const CropModal = ({ isOpen, setIsOpen, modalImage, handleSubmission, resetSubmission }:
    { isOpen: boolean, setIsOpen: any, modalImage: string, handleSubmission: any, resetSubmission: any }) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [result, setResult] = useState({})

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        console.log(croppedArea, croppedAreaPixels)
        setResult([croppedArea, croppedAreaPixels])
    }

    const handleClose = () => {
        setIsOpen(false)
        resetSubmission()
    }


    return <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={() => handleClose()}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                    transition
                    className="w-full max-w-md rounded-xl bg-zinc-900 p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                >
                    <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                        Crop
                    </DialogTitle>
                    <div className="relative h-[400px] w-[400px]">
                        <Cropper
                            image={modalImage}
                            aspect={1}
                            crop={crop}
                            zoom={zoom}
                            onCropComplete = {onCropComplete}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            cropShape='round'
                        />
                    </div>
                    <input type="range" value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => {
                            setZoom(Number(e.target.value))
                        }} />
                    <div className="flex flex-row mt-4">
                        <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={() => {
                                handleSubmission(result)
                                setIsOpen(false)
                            }
                            }
                        >
                            Submit
                        </Button>
                        <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            onClick={() => {
                                handleClose()
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogPanel>
            </div>
        </div>
    </Dialog>
}


const ProfilePictureComponent = () => {

    const {
        register: registerImage,
        handleSubmit: handleImageSubmit,
        watch: watchImage,
        reset: resetImage,
        formState: { errors: errorsImage },
    } = useForm<ImageInput>()

    const [isModalOpen, setModalOpen] = useState(false)
    const [modalImage, setModalImage] = useState<any>('')

    const [submittedFile, setSubmittedFile] = useState('')

    const { userInfo, refreshAuthUser } = useContext(AuthContext)


    const handleSubmission = async (cropResult: any) => {
        let base64 = await getCroppedImg(modalImage, cropResult[1])
        updateUserInfo({profilePicture: base64}).then((resp) => {
            handleToast(resp)
            refreshAuthUser()
            resetImage()
        })
    }

    const resetSubmission = () => {
        resetImage()
    }



    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setModalImage(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    return <form onSubmit={handleImageSubmit(() =>{})}>
        <CropModal isOpen={isModalOpen} setIsOpen={(setModalOpen)}
            modalImage={modalImage}
            handleSubmission={handleSubmission} 
            resetSubmission = {resetSubmission}/>

        <label htmlFor="fileField">
            <div className="w-full">
                <div className="w-full flex items-center justify-center p-2">
                    <div className="relative group cursor-pointer">
                        <img src={
                            userInfo === null ? "/assets/images/default owlcroraptor.png" :
                                userInfo.profilePicture === undefined ? "/assets/images/default owlcroraptor.png" : userInfo.profilePicture
                        }
                            className="w-30 rounded-full brightness-100 group-hover:brightness-70 transition" />
                        <Icon icon="lucide:edit"
                            className={`opacity-0 group-hover:opacity-100 transition
                                            absolute text-3xl bottom-0 right-1 bg-zinc-800 rounded p-1`} />

                    </div>
                </div>
            </div>
        </label>
        <input type="file" id="fileField" accept="image/*" hidden={true}
        
            {...registerImage("profilePicture")}
            onChange={(e) => {
                if (e.target.value !== '') {
                    setModalOpen(true)
                    onSelectFile(e)
                }
            }} 
            />
        <input type="file" id="submittedFile" accept="image/*" hidden={true}
            value={submittedFile}
        />
    </form>
}


//getting long and unwieldy. consider refactoring soon...
export function SettingsPage() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    let navigate = useNavigate()

    const { userInfo, refreshAuthUser } = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(false)


    const onSubmit: SubmitHandler<Inputs> = (data, e) => {
        updateUserInfo(data).then((resp) => {
            handleToast(resp)
            setIsEditing(false)
            refreshAuthUser()
        })

    }

    return (
        <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
                <div className="flex flex-col items-center text-xl">
                    Settings
                </div>
                <div className="space-y-6 px-4">
                    <div className="flex justify-center items-center w-full 
                    rounded-3xl border p-6 
                    dark:border-gray-700">
                        <div className="flex flex-col">

                            <ProfilePictureComponent/>

                            {
                                userInfo !== null &&

                                <form onSubmit={handleSubmit(onSubmit)}
                                >
                                    <fieldset disabled={!isEditing} className="flex flex-col space-y-2">
                                        <div>
                                            Username: <SettingsInput
                                                defaultValue={userInfo.username}
                                                value="username"
                                                register={register}
                                                required={true} />
                                        </div>
                                        <div>
                                            Email: <SettingsInput
                                                defaultValue={userInfo.email}
                                                value="email"
                                                register={register}
                                                disabled />
                                        </div>
                                        <div>
                                            Pronouns: <SettingsInput
                                                defaultValue={userInfo.pronouns}
                                                value="pronouns"
                                                register={register} />
                                        </div>
                                        <div>
                                            Status: <i><SettingsInput
                                                defaultValue={userInfo.status}
                                                value="status"
                                                register={register} /></i>
                                        </div>

                                        <div className="py-2 flex flex-row gap-x-2">
                                            <span className={`${isEditing ? "hidden" : "visible"} cursor-pointer 
                                    bg-gray-700 hover:bg-gray-600 p-2 rounded`}
                                                onClick={() => {
                                                    setIsEditing(true)
                                                }}>
                                                Edit
                                            </span>

                                            <input type="submit" className="disabled:hidden visible cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded" />

                                            <input type="reset" className={`${isEditing ? "visible" : "hidden"} cursor-pointer 
                                    bg-gray-700 hover:bg-gray-600 p-2 rounded`}
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    reset()
                                                }} value="Cancel" />
                                        </div>
                                    </fieldset>
                                </form>
                            }
                        </div>


                    </div>
                </div>
            </div>
        </div >
    );
}