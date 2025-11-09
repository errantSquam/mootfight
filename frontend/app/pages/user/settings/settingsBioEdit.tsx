import { useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
import { MDXEditor } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

import { MarkdownEditor } from '~/components/markdownEditor';
import { useRef } from 'react';
import { type MDXEditorMethods } from '@mdxeditor/editor';
import { useContext } from 'react';
import { AuthContext } from '~/provider/authProvider';
import { Link } from 'react-router';
import { useEffect } from 'react';
import sanitize from 'sanitize-html'
import { SanitizedMarkdown } from '~/components/profile/sanitizedMarkdown';
import { updateUserSettings } from '~/functions/apiHandlers';

export function BioEditPage() {
    const ref = useRef<MDXEditorMethods>(null)
    const { userInfo, refreshAuthUser, authLoaded } = useContext(AuthContext)
    const [markdown, setMarkdown] = useState('')
    const [isPreview, setPreview] = useState(false)

    useEffect(() => {
        if (userInfo !== null) {
            if (userInfo.bio !== undefined) {
                setMarkdown(userInfo.bio)
                ref.current?.setMarkdown(userInfo.bio)
            }
        }
    }, [authLoaded])


    const onSubmit = () => {
        let mdData = sanitize(markdown,
                                {
                                    allowedTags: ['u', 'img'],
                                    allowedAttributes: {
                                        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
                                    },

                                }
                            )

            

        updateUserSettings({bio: mdData}, refreshAuthUser)

    }




    return <div className="p-20 flex flex-col space-y-2">
        <div>Please remember to add 'https://' in front of your links!</div>
        <div className="flex flex-row space-x-2">
            <Link to="/user/settings" className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded w-20 flex items-center text-center justify-center">
                <div>Back</div>
            </Link>
            <div onClick={() => { setPreview(!isPreview) }}
                className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded w-20 flex items-center text-center justify-center">
                <div>{!isPreview ? 'Preview' : 'Edit'}</div>
            </div>
            <div onClick={() => onSubmit()} className="cursor-pointer bg-gray-700 hover:bg-gray-600 p-2 rounded w-20 flex items-center text-center justify-center">
                <div>Submit</div>
            </div>
        </div>
        <div>
            <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} ref = {ref}/>
            
        </div>


    </div>
}