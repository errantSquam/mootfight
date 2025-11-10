import { useForm, type SubmitHandler } from "react-hook-form"
import { type UseFormRegister } from "react-hook-form"
import { useNavigate } from "react-router"
import { useState } from "react"
import { handleToast } from "~/functions/handleToast"
import { useContext } from "react"
import { AuthContext } from "~/provider/authProvider"
import 'react-easy-crop/react-easy-crop.css'
import { ProfilePictureComponent } from "~/components/settings/cropComponents"
import { Link } from "react-router"
import { updateUserSettings } from "~/functions/apiHandlers"


type Inputs = {
    uid: string
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
        updateUserSettings(data, refreshAuthUser).then(() => {
            setIsEditing(false)
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

                            <div className="w-full">
                                <div className="w-full flex items-center justify-center p-2">
                                    <ProfilePictureComponent />
                                </div>
                            </div>

                            {
                                userInfo !== null &&

                                <form onSubmit={handleSubmit(onSubmit)}
                                >
                                    <fieldset disabled={!isEditing} className="flex flex-col space-y-2">
                                        <div>
                                            User ID: <span className="italic opacity-70"><SettingsInput
                                                defaultValue={userInfo.uid}
                                                value="uid"
                                                register={register}
                                                disabled /></span>
                                        </div>
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

                <Link to="/user/settings/bio" className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded">
                    Edit Bio
                </Link>
            </div>
        </div >
    );
}