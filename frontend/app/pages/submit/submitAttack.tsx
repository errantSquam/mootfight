import { useForm, type SubmitHandler } from "react-hook-form"

type Inputs = {
    uid: string
}

export function SubmitAttackPage() {
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

    return <div>
        
    </div>

}