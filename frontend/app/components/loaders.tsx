import { Icon } from "@iconify/react"
import { useState } from "react"

export const ImageSkeletonComponent = ({ className }: { className: string }) => {
    return <div className={`flex items-center justify-center ${className}
    rounded-sm bg-gray-700`}>
        <Icon icon="material-symbols:image-outline-rounded" className="w-10 h-10 text-gray-200 dark:text-gray-600" />
    </div>
}

export const ImageWithLoader = ({ src, className, spoiler = undefined }:
    { src: string, className: string, spoiler?: string | undefined }) => {
    const [isLoading, setIsLoading] = useState(true)

    return <div className="relative overflow-hidden group">
        <div className={`absolute opacity-0 group-hover:opacity-100 transition 
        bottom-0 left-0 right-0 top-0 grid place-items-center text-white z-99
        text-ellipsis p-6`}>
            {spoiler}
            </div>
        {(spoiler !== undefined && spoiler !== "") && 
        <div className="absolute opacity-0 group-hover:opacity-50 transition bg-zinc-900 z-98 w-full h-full" />}
        <img src={src} onLoad={() => setIsLoading(false)}
            className={`${className} ${isLoading ? "opacity-0 absolute" : "opacity-100 relative"}
        ${(spoiler !== undefined && spoiler !== "") ? "blur-md" : "blur-none"}`} />
        <ImageSkeletonComponent className={`${className} ${isLoading ? "visible" : "hidden"}`} />
    </div>


}