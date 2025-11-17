import { Icon } from "@iconify/react"

export const MootButton = ({children, className = undefined, isLoading = false,
    onClick = () => {}
} : 
    {
        children: React.ReactNode,
        className?: string,
        isLoading?: boolean,
        onClick?: () => void
    }
) => {

    return <div onClick = {onClick} className={`flex bg-zinc-700 hover:bg-zinc-600 p-2 
        cursor-pointer rounded select-none
            text-center justify-center ${className}`}>
                {isLoading ? <Icon icon="eos-icons:loading" className = "text-lg"/> : <span>{children}</span>}
            </div>
}

export const MootButtonInput = ({type, value, className = undefined, onClick = () => {}} : 
    {type: string, value: string, className?: string,
        onClick?: () => void
    }) => {
    return <input type={type} value={value}
                className={`w-full bg-zinc-700 hover:bg-zinc-600 p-2 cursor-pointer rounded ${className}`} 
                onClick = {onClick}/>    
}

export const MootButtonSubmit = () => {
    return <MootButtonInput type = "submit" value = "Submit"/>
}