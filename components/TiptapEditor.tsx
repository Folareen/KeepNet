"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

type TiptapEditorProps = {
    content: string
    onChange: (content: string) => void
    editable?: boolean
}

export default function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editable && !editor) {
        return <div className='prose prose-invert max-w-none' dangerouslySetInnerHTML={{ __html: content }} />
    }

    if (!editor) {
        return null
    }

    return (
        <div className='bg-gray-900 rounded'>
            {editable && (
                <div className='border-b border-gray-700 p-2 flex gap-2 flex-wrap'>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Bold
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Italic
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('strike') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Strike
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        H2
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`px-3 py-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        H3
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Bullet List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('orderedList') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Ordered List
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Code Block
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`px-3 py-1 rounded ${editor.isActive('blockquote') ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700`}
                    >
                        Quote
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className='px-3 py-1 rounded bg-gray-700 hover:bg-blue-700'
                    >
                        Divider
                    </button>
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
    )
}
