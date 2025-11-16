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

    return <div onClick = {onClick} className={`cursor-pointer bg-gray-700 
            hover:bg-gray-600 p-2 rounded flex items-center 
            text-center justify-center ${className}`}>
                {isLoading ? <Icon icon="eos-icons:loading" className = "text-lg"/> : <span>{children}</span>}
            </div>
}