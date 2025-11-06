import { useForm, type SubmitHandler } from "react-hook-form"
import { type UseFormRegister } from "react-hook-form"
import { toast } from "react-toastify"
import { signIn } from "~/api/firebase"
import { useNavigate } from "react-router"
import { useState } from "react"
import { handleToast } from "~/functions/handleToast"
import { useContext } from "react"
import { AuthContext } from "~/provider/authProvider"

type Inputs = {
    username: string
    email: string
    pronouns: string
    status:string
}

const SettingsInput = ({ defaultValue, value, register, isPassword = false, disabled = false }:
    { defaultValue:any, value: any, register: UseFormRegister<Inputs>, isPassword?: boolean, disabled?:boolean }) => {
    return <input className={`disabled:bg-gray-800/0 
                                        disabled:border-white/0
                                        border border-white rounded-md p-2 bg-gray-800 transition`}
        defaultValue={defaultValue} 
        placeholder = "Unset"
        disabled = {disabled}
         {...register(value, { required: true })}

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

    const { userInfo, setUserInfo } = useContext(AuthContext)
    const [isEditing, setIsEditing] = useState(false)


    const onSubmit: SubmitHandler<Inputs> = (data, e) => {
        /*signIn(data.email, data.password).then((resp) => {
            handleToast(resp)
            if (resp.toastType === "success") {
                navigate('/')

            }
        })*/

    }

    return (
        <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
                <header className="flex flex-col items-center text-xl">
                    Settings
                </header>
                <div className="space-y-6 px-4">
                    <div className="flex justify-center items-center w-full 
                    rounded-3xl border p-6 
                    dark:border-gray-700">
                        {
                            userInfo !== null &&
                            <form onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col space-y-4 items-center">
                                <fieldset disabled = {!isEditing} >
                                    <div>
                                        Username: <SettingsInput 
                                        defaultValue = {userInfo.username} 
                                        value = "username"
                                        register = {register}/>
                                    </div>
                                    <div>
                                        Email: <SettingsInput 
                                        defaultValue = {userInfo.email} 
                                        value = "email"
                                        register = {register}
                                        disabled/>
                                    </div>
                                    <div>
                                        Pronouns: <SettingsInput 
                                        defaultValue = {userInfo.pronouns} 
                                        value = "pronouns"
                                        register = {register}/>
                                    </div>
                                    <div>
                                        Status: <SettingsInput 
                                        defaultValue = {userInfo.status} 
                                        value = "status"
                                        register = {register}/>
                                    </div>
                                    <span className = {`${isEditing ? "hidden" : "visible"} cursor-pointer 
                                    bg-gray-700 hover:bg-gray-600 p-2 rounded`}
                                    onClick = {() => {
                                        setIsEditing(true)
                                        }}>
                                        Edit
                                    </span>

                                    <input type="submit" className="disabled:hidden visible cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded" />
                                    
                                    <input type = "reset" className = {`${isEditing ? "visible" : "hidden"} cursor-pointer 
                                    bg-gray-700 hover:bg-gray-600 p-2 rounded`}
                                    onClick = {() => {
                                        setIsEditing(false)
                                        reset()
                                        }} value = "Cancel"/>
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
        </div>
    );
}