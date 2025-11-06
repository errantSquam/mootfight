import { useForm, type SubmitHandler } from "react-hook-form"

type Inputs = {
    example: string
    exampleRequired: string
}

export function Login() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

    return (
        <main className="flex items-center justify-center pt-16 pb-4">
            <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
                <header className="flex flex-col items-center gap-9 text-xl">
                    Login
                </header>
                <div className="max-w-[300px] w-full space-y-6 px-4">
                    <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <input defaultValue="test" {...register("example")} />

                            <input {...register("exampleRequired", { required: true })} />

                            {errors.exampleRequired && <span>This field is required</span>}

                            <input type="submit" />
                        </form>
                    </nav>
                </div>
            </div>
        </main>
    );
}