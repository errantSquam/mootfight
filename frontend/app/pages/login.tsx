import { useForm, type SubmitHandler } from "react-hook-form"
import { type UseFormRegister } from "react-hook-form"

type Inputs = {
    email: string
    password: string
}

const RequiredField = ({ title, value, register }: { title: string, value: any, register: UseFormRegister<Inputs> }) => {
    return <div>
        <div>{title}</div>
        <input className="border border-white rounded-md p-2 bg-gray-800"
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

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)

    }

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
                <header className="flex flex-col items-center text-xl">
                    Login
                </header>
                <div className="w-1/3 space-y-6 px-4">
                    <nav className="flex justify-center items-center w-full 
                    rounded-3xl border p-6 
                    dark:border-gray-700">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 items-center">
                            <RequiredField title="Email"
                                value="email" register={register} />
                            
                            {errors.email && <span>This field is required</span>}

                            <RequiredField title="Password"
                                value="password" register={register} />

                            {errors.password && <span>This field is required</span>}

                            <input type="submit" className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded" />
                        </form>
                    </nav>
                </div>
            </div>
        </main>
    );
}