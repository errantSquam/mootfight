import { useState } from 'react';
import { MDXEditor } from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import {
    UndoRedo,
    BlockTypeSelect,
    BoldItalicUnderlineToggles, CodeToggle, CreateLink,
    InsertImage,
    toolbarPlugin,
    InsertTable,
    ListsToggle,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    quotePlugin,
    tablePlugin,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    imagePlugin,
    listsPlugin,

    thematicBreakPlugin,
    headingsPlugin
} from '@mdxeditor/editor';
import { useRef } from 'react';
import { type MDXEditorMethods } from '@mdxeditor/editor';
import { useContext } from 'react';
import { AuthContext } from '~/provider/authProvider';
import { Link } from 'react-router';
import { useEffect } from 'react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import sanitize from 'sanitize-html'
import rehypeExternalLinks from 'rehype-external-links'
import { updateUserInfo } from '~/api/firebase';
import { handleToast } from '~/functions/handleToast';
import { SanitizedMarkdown } from '~/components/profile/sanitizedMarkdown';

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

    useEffect(() => {
        if (!isPreview) {
            ref.current?.setMarkdown(markdown)
        }

    }, [isPreview])

    const onSubmit = () => {
        let mdData = sanitize(markdown,
                                {
                                    allowedTags: ['u', 'img'],
                                    allowedAttributes: {
                                        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
                                    },

                                }
                            )

            
        updateUserInfo({bio: mdData}).then((resp) => {
            handleToast(resp)
            refreshAuthUser()
        })

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
        <div className="border border-zinc-500 rounded">
            {isPreview &&
                <div className="p-2">
                    <SanitizedMarkdown markdown = {markdown}/>
                </div>}
            {!isPreview &&
                <MDXEditor markdown={''}
                    ref={ref}
                    onChange={(e) => { setMarkdown(e) }}
                    plugins={[
                        headingsPlugin(),
                        thematicBreakPlugin(),
                        tablePlugin(),
                        linkDialogPlugin(),
                        linkPlugin(),
                        imagePlugin(),
                        listsPlugin(),
                        //quotePlugin(), need to style before we think about this...
                        diffSourcePlugin({ viewMode: 'rich-text' }),
                        toolbarPlugin({
                            toolbarClassName: 'my-classname',
                            toolbarContents: () => (
                                <DiffSourceToggleWrapper>
                                    <UndoRedo />
                                    <BoldItalicUnderlineToggles />
                                    <BlockTypeSelect />
                                    <InsertThematicBreak />


                                    <CodeToggle />
                                    <CreateLink />
                                    <InsertImage />
                                    <InsertTable />
                                    <ListsToggle />
                                </DiffSourceToggleWrapper>
                            )
                        })]}
                    className="dark-theme"

                />
            }
        </div>


    </div>
}