import { useForm, type SubmitHandler } from "react-hook-form"

type Inputs = {
    uid: string
}

export function SubmitCharacterPage() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit:SubmitHandler<Inputs> = (data, e) => {
        console.log(data)

    }

    return <div className = "flex flex-col items-center justify-center">
        <h1>Submit Character</h1>

        
    </div>

}