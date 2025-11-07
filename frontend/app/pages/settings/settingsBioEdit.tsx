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

    thematicBreakPlugin,
    headingsPlugin 
} from '@mdxeditor/editor';
import { useRef } from 'react';
import { type MDXEditorMethods } from '@mdxeditor/editor';

export function BioEditPage() {
    const ref = useRef<MDXEditorMethods>(null)

    return <div className="text-white p-20">
        <div className="border border-zinc-500 rounded">
            <MDXEditor markdown='# Hello world!'
                ref={ref}
                plugins={[
                    headingsPlugin(),
                    thematicBreakPlugin(),
                    tablePlugin(),
                    //quotePlugin(), need to style before we think about this...
                    diffSourcePlugin({viewMode: 'rich-text'}),
                    toolbarPlugin({
                    toolbarClassName: 'my-classname',
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                            <InsertThematicBreak/>


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
        </div>


    </div>
}