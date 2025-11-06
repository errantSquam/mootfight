import { useForm, type SubmitHandler } from "react-hook-form"
import { type UseFormRegister } from "react-hook-form"
import { toast } from "react-toastify"
import { signIn } from "~/api/firebase"
import { useNavigate } from "react-router"
import { useState } from "react"
import { handleToast } from "~/functions/handleToast"
import { useOutletContext } from "react-router"

type Inputs = {
    email: string
    password: string
}

const RequiredField = ({ title, value, register, isPassword = false }: 
    { title: string, value: any, register: UseFormRegister<Inputs>, isPassword?:boolean }) => {
    return <div>
        <div>{title}</div>
        <input className="border border-white rounded-md p-2 bg-gray-800"
            type = {isPassword ? "password" : "input"}
            {...register(value, { required: true })} />
    </div>
}

export function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    let navigate = useNavigate()

    const onSubmit: SubmitHandler<Inputs> = (data, e) => {
        signIn(data.email, data.password).then((resp) => {
            handleToast(resp)
            if (resp.toastType === "success") {
                navigate('/')
                
            } 
        })

    }

    return (
        <div className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
                <div className="flex flex-col items-center text-xl">
                    Login
                </div>
                <div className="space-y-6 px-4">
                    <div className="flex justify-center items-center w-full 
                    rounded-3xl border p-6 
                    dark:border-gray-700">
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
                    </div>
                </div>
            </div>
        </div>
    );
}