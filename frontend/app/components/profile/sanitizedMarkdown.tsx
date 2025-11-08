
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import sanitize from 'sanitize-html'

export function SanitizedMarkdown({markdown}:{markdown: string}) {
    return <div className = "markdown"><Markdown remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw,
        ]}
    >{
            sanitize(markdown,
                {
                    allowedTags: ['u', 'img'],
                    allowedAttributes: {
                        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
                    },

                }
            )
        }</Markdown></div>
}