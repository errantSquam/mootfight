import { useForm, type SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "~/provider/authProvider"
import { Icon } from "@iconify/react"
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import React, { useRef } from "react";
import Cropper, { type Area } from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import getCroppedImg from "~/functions/crop"
import { updateUserSettings } from "~/functions/apiHandlers"
import { getPfp } from "~/functions/helper"
import { Modal } from "../genericComponents"

type ImageInput = {
    profilePicture: File
}


const CropModal = ({ isOpen, setIsOpen, modalImage, handleSubmission, resetSubmission }:
    {
        isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
        modalImage: string, handleSubmission: (cropResult: Array<Area>) => Promise<void>,
        resetSubmission: () => void
    }) => {

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [result, setResult] = useState<Array<Area>>([])

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setResult([croppedArea, croppedAreaPixels])
    }

    const handleClose = () => {
        setIsOpen(false)
        resetSubmission()
    }


    return <Modal isOpen={isOpen} handleClose={handleClose} title="Crop">
        <div className="relative h-[400px] w-[400px]">
            <Cropper
                image={modalImage}
                aspect={1}
                crop={crop}
                zoom={zoom}
                onCropComplete={onCropComplete}
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
        <div className="flex flex-row mt-4 gap-x-2">
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
    </Modal>
}

export const ProfilePictureComponent = () => {

    const {
        register: registerImage,
        handleSubmit: handleImageSubmit,
        watch: watchImage,
        reset: resetImage,
        formState: { errors: errorsImage },
    } = useForm<ImageInput>()

    const [isModalOpen, setModalOpen] = useState(false)
    const [modalImage, setModalImage] = useState<string>('')

    const [submittedFile, setSubmittedFile] = useState('')

    const { userInfo, refreshAuthUser } = useContext(AuthContext)


    const handleSubmission = async (cropResult: Array<Area>) => {
        let base64 = await getCroppedImg(modalImage, cropResult[1])
        if (base64 === null) {
            //error?
            console.log("pfp crop error")
            return
        }

        updateUserSettings({ profilePicture: base64 }, refreshAuthUser).then((resp) => {
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

    return <form onSubmit={handleImageSubmit(() => { })}>
        <CropModal isOpen={isModalOpen} setIsOpen={(setModalOpen)}
            modalImage={modalImage}
            handleSubmission={handleSubmission}
            resetSubmission={resetSubmission} />

        <label htmlFor="fileField">
            <div className="relative group cursor-pointer">
                <img src={
                    getPfp(userInfo.profilePicture)
                }
                    className="w-30 rounded-full brightness-100 group-hover:brightness-70 transition" />
                <Icon icon="lucide:edit"
                    className={`opacity-0 group-hover:opacity-100 transition
                                            absolute text-3xl bottom-0 right-1 bg-zinc-800 rounded p-1`} />

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
            defaultValue={submittedFile}
        />
    </form>
}
