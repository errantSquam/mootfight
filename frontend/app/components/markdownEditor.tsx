import type { MDXEditorMethods } from "@mdxeditor/editor"

import { useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
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
    tablePlugin,
    InsertThematicBreak,
    linkDialogPlugin,
    linkPlugin,
    imagePlugin,
    listsPlugin,

    thematicBreakPlugin,
    headingsPlugin
} from '@mdxeditor/editor';
import { useEffect } from 'react';
import { SanitizedMarkdown } from "./profile/sanitizedMarkdown";
import { Button } from "@mdxeditor/editor";

export const MarkdownEditor = ({ markdown, setMarkdown, ref }:
    {
        markdown: string, setMarkdown: Dispatch<SetStateAction<string>>,
        ref: RefObject<MDXEditorMethods> | any //crying because i can't get the typing to work
    }) => {


    const [isPreview, setIsPreview] = useState(false)
    useEffect(() => {
        if (!isPreview && ref) {
            ref.current?.setMarkdown(markdown)
        }

    }, [isPreview])

    return <div className="border border-zinc-500 rounded">
        {isPreview &&
            <div>
                <div className="bg-zinc-900 w-full p-1 flex flex-row">
                    <div
                        className="cursor-pointer bg-zinc-800 p-1 px-2 rounded hover:bg-zinc-700"
                        onClick={() => { setIsPreview(!isPreview) }}>Resume Edit</div>
                </div>
                <div className="p-2">
                    <SanitizedMarkdown markdown={markdown} />
                </div>
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

                                <div
                                    className="cursor-pointer bg-zinc-800 p-1 px-2 rounded hover:bg-zinc-700"
                                    onClick={() => { setIsPreview(!isPreview) }}>Preview</div>
                            </DiffSourceToggleWrapper>
                        )
                    })]}
                className="dark-theme"

            />
        }
    </div>
}