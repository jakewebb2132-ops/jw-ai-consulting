import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontSize } from './extensions/FontSize';
import { jwTheme } from '../../theme/jwTheme';
import { 
  TextBolder, 
  TextItalic, 
  TextAlignLeft, 
  TextAlignCenter, 
  ListBullets, 
  ListNumbers,
  DropHalfBottom
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
      TextStyle,
      Color,
      FontSize,
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
          isHeading ? 'text-3xl font-bold tracking-tight' : 'text-lg leading-relaxed',
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
          
          {/* Advanced Formatting: Color & Size */}
          <div className="w-[1px] h-5 bg-zinc-700 mx-1" />

          {/* Color Picker Native Input styled conditionally */}
          <div className="relative flex items-center justify-center p-1 hover:bg-zinc-800 rounded-md transition-colors group cursor-pointer" title="Text Color">
            <DropHalfBottom size={18} className="text-zinc-300 group-hover:text-white" />
            <input
              type="color"
              onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
              value={editor.getAttributes('textStyle').color || (isHeading && theme === 'dark' ? jwTheme.colors.primary : (isHeading ? jwTheme.colors.textHeading : jwTheme.colors.textBody))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Font Size Dropdown */}
          <select 
            onChange={event => editor.chain().focus().setFontSize(event.target.value).run()}
            className="bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800 border-none outline-none text-xs font-medium cursor-pointer rounded px-1 py-1 appearance-none text-center min-w-[3ch]"
            value={editor.getAttributes('textStyle').fontSize || ''}
            title="Text Size"
          >
            <option className="bg-zinc-900 text-white" value="">Aa</option>
            <option className="bg-zinc-900 text-white" value="12px">12</option>
            <option className="bg-zinc-900 text-white" value="14px">14</option>
            <option className="bg-zinc-900 text-white" value="16px">16</option>
            <option className="bg-zinc-900 text-white" value="18px">18</option>
            <option className="bg-zinc-900 text-white" value="20px">20</option>
            <option className="bg-zinc-900 text-white" value="24px">24</option>
            <option className="bg-zinc-900 text-white" value="30px">30</option>
            <option className="bg-zinc-900 text-white" value="36px">36</option>
            <option className="bg-zinc-900 text-white" value="48px">48</option>
          </select>

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
