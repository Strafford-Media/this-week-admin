import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import React, { ComponentProps, useEffect } from 'react'

export interface RichTextEditorProps extends ComponentProps<'div'> {
  html: string
  text: string
  label?: string
  onValueChange(c: { html: string; text: string }): void
}

export const RichTextEditor = ({
  className = '',
  label = '',
  html,
  text,
  onValueChange,
  ...props
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['image', 'paragraph', 'heading'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        linkOnPaste: true,
      }),
    ],
    content: html || text,
    editorProps: {
      attributes: {
        spellcheck: 'false',
        class: `my-0 h-full w-full p-8 border border-gray-200 bg-white rounded mx-auto focus:outline-none overflow-y-auto`,
      },
    },
    editable: true,
  })

  useEffect(() => {
    editor?.on('update', ({ editor }) => {
      onValueChange({ html: editor.getHTML(), text: editor.getText() })
    })

    return () => {
      editor?.off('update')
    }
  }, [editor])

  useEffect(() => {
    if (!editor) return

    const currentHTML = editor.getHTML()
    if (editor.isEmpty && currentHTML !== (html || text)) {
      editor.commands.setContent(html || text)
    }
  }, [html, text])

  return (
    <div className={`${className} flex flex-col gap-2`} {...props}>
      <label>{label}</label>
      <MenuBar editor={editor} />
      <EditorContent className="prose min-h-0 w-full max-w-full grow" editor={editor} />
    </div>
  )
}

const buttonClasses =
  'whitespace-nowrap px-1 border border-black rounded bg-white text-sm hover:bg-gray-100 focus:bg-gray-200 focus:outline-none disabled:hidden'

const activeClasses = '!bg-black hover:!bg-gray-800 focus:bg-gray-700 !text-white'

interface MenuBarProps extends ComponentProps<'div'> {
  editor: Editor | null
}

const MenuBar = ({ editor, className = '' }: MenuBarProps) => {
  if (!editor) {
    return null
  }

  return (
    <div className={clsx(className, 'no-scrollbar flex max-w-full flex-wrap gap-1 overflow-x-auto')}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('bold') })}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('italic') })}
      >
        italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('strike') })}
      >
        strike
      </button>
      {/* <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('code') })}
      >
        code
      </button> */}
      <VerticalHR />
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive({ textAlign: 'left' }) })}
      >
        left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive({ textAlign: 'center' }) })}
      >
        center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive({ textAlign: 'right' }) })}
      >
        right
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive({ textAlign: 'justify' }) })}
      >
        justify
      </button>
      <VerticalHR />
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('paragraph') })}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('heading', { level: 1 }) })}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('heading', { level: 2 }) })}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('heading', { level: 3 }) })}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('heading', { level: 4 }) })}
      >
        h4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('heading', { level: 5 }) })}
      >
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('heading', { level: 6 }) })}
      >
        h6
      </button>
      {/* <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('bulletList') })}
      >
        bullet list
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('orderedList') })}
      >
        ordered list
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('codeBlock') })}
      >
        code block
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('blockquote') })}
      >
        blockquote
      </button>
      <button className={buttonClasses} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button className={buttonClasses} onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <VerticalHR />
      <button
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href
          const url = window.prompt('URL', previousUrl)

          // cancelled
          if (url === null) {
            return
          }

          // empty
          if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()

            return
          }

          // update link
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}
        className={clsx(buttonClasses, { [activeClasses]: editor.isActive('link') })}
      >
        link
      </button>
      <button
        className={buttonClasses}
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
      >
        unset link
      </button>
      <VerticalHR />
      <button className={buttonClasses} onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear styles
      </button>
      <button className={buttonClasses} onClick={() => editor.chain().focus().undo().run()}>
        undo
      </button>
      <button className={buttonClasses} onClick={() => editor.chain().focus().redo().run()}>
        redo
      </button>
    </div>
  )
}

interface VerticalHRProps extends ComponentProps<'div'> {}

const VerticalHR = ({ className = '', ...props }: VerticalHRProps) => {
  return <div className={clsx(className, 'mx-1 min-w-px self-stretch border-none bg-black')} {...props} />
}
