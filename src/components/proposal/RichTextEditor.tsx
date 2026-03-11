import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { jwTheme } from '../../theme/jwTheme';
import { 
  TextBolder, 
  TextItalic, 
  TextAlignLeft, 
  TextAlignCenter, 
  ListBullets, 
  ListNumbers 
} from 'phosphor-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  isHeading?: boolean;
  disabled?: boolean;
  theme?: string;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  isHeading = false, 
  disabled = false,
  theme = 'light',
  placeholder = 'Type here...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: isHeading ? { levels: [2] } : false,
        bulletList: isHeading ? false : {},
        orderedList: isHeading ? false : {},
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Return HTML rather than JSON for simpler storage and rendering
      // in the Public and PDF views.
      const html = editor.getHTML();
      // Strip empty paragraph tags if it's completely empty so placeholder logic works
      if (html === '<p></p>' || html === '<h2></h2>') {
        onChange('');
      } else {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: [
          'prose max-w-none focus:outline-none w-full break-words',
          isHeading ? 'text-3xl font-bold tracking-tight' : 'text-lg leading-relaxed whitespace-pre-wrap',
          !content ? 'is-empty' : ''
        ].join(' '),
        style: `
          font-family: ${isHeading ? jwTheme.typography.fontHeading : jwTheme.typography.fontBody};
          color: ${isHeading && theme === 'dark' ? jwTheme.colors.primary : (isHeading ? jwTheme.colors.textHeading : jwTheme.colors.textBody)};
          min-height: ${isHeading ? '1.2em' : '4em'};
        `
      },
    },
  });

  // Sync content if it changes externally (e.g., from DB load or side-panel edit)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Headless Bubble Menu (only appears when text is highlighted) */}
      {!disabled && editor && (
        <BubbleMenu 
          editor={editor} 
          className="flex items-center gap-1 bg-zinc-900 shadow-xl border border-zinc-700 rounded-lg p-1.5 backdrop-blur-md opacity-95 transition-opacity"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
            title="Bold (Cmd+B)"
          >
            <TextBolder size={18} weight={editor.isActive('bold') ? 'bold' : 'regular'} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
            title="Italic (Cmd+I)"
          >
            <TextItalic size={18} weight={editor.isActive('italic') ? 'bold' : 'regular'} />
          </button>
          
          <div className="w-[1px] h-5 bg-zinc-700 mx-1" />

          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
            title="Align Left"
          >
            <TextAlignLeft size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-1.5 rounded-md transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
            title="Align Center"
          >
            <TextAlignCenter size={18} />
          </button>

          {!isHeading && (
            <>
              <div className="w-[1px] h-5 bg-zinc-700 mx-1" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
                title="Bullet List"
              >
                <ListBullets size={18} weight={editor.isActive('bulletList') ? 'bold' : 'regular'} />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}`}
                title="Numbered List"
              >
                <ListNumbers size={18} weight={editor.isActive('orderedList') ? 'bold' : 'regular'} />
              </button>
            </>
          )}
        </BubbleMenu>
      )}

      {/* Actual Editor Content */}
      <div className={`tiptap-wrapper ${!content ? 'is-empty' : ''}`} data-placeholder={placeholder}>
        <EditorContent editor={editor} />
      </div>

    </div>
  );
};

export default RichTextEditor;
