"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import {
    MdFormatBold,
    MdFormatItalic,
    MdStrikethroughS,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdCode,
    MdFormatQuote,
    MdHorizontalRule,
    MdTitle,
    MdUndo,
    MdRedo
} from 'react-icons/md'

type TiptapEditorProps = {
    content: string
    onChange: (content: string) => void
    editable?: boolean
    isFullscreen?: boolean
}

const ToolbarButton = ({
    onClick,
    isActive,
    icon: Icon,
    tooltip
}: {
    onClick: () => void;
    isActive?: boolean;
    icon: any;
    tooltip: string;
}) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-all relative group ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
        type="button"
    >
        <Icon size={20} />
        <span className='invisible group-hover:visible absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 border border-gray-700'>
            {tooltip}
        </span>
    </button>
)

export default function TiptapEditor({ content, onChange, editable = true, isFullscreen = false }: TiptapEditorProps) {
    const editorClasses = isFullscreen
        ? 'prose prose-invert max-w-none focus:outline-none h-full w-full p-8 text-base'
        : 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6';

    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: editorClasses,
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

    const containerClasses = isFullscreen
        ? 'bg-gray-950 h-full w-full flex flex-col'
        : 'bg-gray-900 rounded-xl border border-gray-800 overflow-hidden';

    const toolbarClasses = isFullscreen
        ? 'p-3 bg-gray-900 border-b border-gray-800'
        : 'border-b border-gray-700 p-3 bg-gray-800';

    return (
        <div className={containerClasses}>
            {editable && (
                <div className={toolbarClasses}>
                    <div className='flex gap-1 flex-wrap'>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            icon={MdUndo}
                            tooltip="Undo (Ctrl+Z)"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            icon={MdRedo}
                            tooltip="Redo (Ctrl+Y)"
                        />

                        <div className='w-px h-8 bg-gray-700/50 mx-1'></div>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            icon={MdFormatBold}
                            tooltip="Bold (Ctrl+B)"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            icon={MdFormatItalic}
                            tooltip="Italic (Ctrl+I)"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={editor.isActive('strike')}
                            icon={MdStrikethroughS}
                            tooltip="Strikethrough"
                        />

                        <div className='w-px h-8 bg-gray-700/50 mx-1'></div>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive('heading', { level: 1 })}
                            icon={() => <MdTitle size={20} />}
                            tooltip="Heading 1"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive('heading', { level: 2 })}
                            icon={() => <span className='text-lg font-bold'>H2</span>}
                            tooltip="Heading 2"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            isActive={editor.isActive('heading', { level: 3 })}
                            icon={() => <span className='text-base font-bold'>H3</span>}
                            tooltip="Heading 3"
                        />

                        <div className='w-px h-8 bg-gray-700/50 mx-1'></div>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            icon={MdFormatListBulleted}
                            tooltip="Bullet List"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            icon={MdFormatListNumbered}
                            tooltip="Numbered List"
                        />

                        <div className='w-px h-8 bg-gray-700/50 mx-1'></div>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            isActive={editor.isActive('codeBlock')}
                            icon={MdCode}
                            tooltip="Code Block"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            icon={MdFormatQuote}
                            tooltip="Quote"
                        />
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            icon={MdHorizontalRule}
                            tooltip="Horizontal Line"
                        />
                    </div>
                </div>
            )}
            <div className={isFullscreen ? 'flex-1 overflow-y-auto min-h-0' : 'min-h-[500px]'}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
