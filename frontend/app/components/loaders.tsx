import { Icon } from "@iconify/react"
import { useState } from "react"

const ImageSkeletonComponent = ({className} : {className:string}) => {
    return <div className={`flex items-center justify-center ${className}
    rounded-sm bg-gray-700`}>
        <Icon icon = "material-symbols:image-outline-rounded" className="w-10 h-10 text-gray-200 dark:text-gray-600" />
    </div>
}

export const ImageWithLoader = ({src, className}: {src: string, className:string}) => {
    const [isLoading, setIsLoading] = useState(true)

    return <>
    <img src = {src} onLoad = {() => setIsLoading(false)} 
    className = {`${className} ${isLoading ? "opacity-0 absolute":"opacity-100 relative"}`}/>
    <ImageSkeletonComponent className = {`${className} ${isLoading ? "visible":"hidden"}`}/>

    
    </>


}