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
import pkg from "croppie"; //resolve this later... might be worth making a d.ts file too!

const { Croppie } = pkg

const croppieOptions = {
    showZoomer: true,
    enableOrientation: true,
    mouseWheelZoom: "ctrl",
    viewport: {
        width: 200,
        height: 200,
        type: "circle"
    },
    boundary: {
        width: "50vw",
        height: "50vh"
    }
};

type Inputs = {
    username: string
    email: string
    pronouns: string
    status: string
}

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

    const handleImageUpload = () => {

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


                    {/*
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 items-center">
                            <RequiredField title="Email"
                                value="email" register={register} />

                            {errors.email && <span>This field is required</span>}

                            <RequiredField title="Password"
                                value="password" register={register} 
                                isPassword/>

                            {errors.password && <span>This field is required</span>}

                            <input type="submit" className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded" />
                        </form>
                        */}
                </div>
            </div>
        </div>
        </div >
    );
}