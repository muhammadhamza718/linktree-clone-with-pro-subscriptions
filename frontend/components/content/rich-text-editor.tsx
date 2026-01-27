'use client';

import { useState } from 'react';

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  initialContent = '',
  onContentChange,
  placeholder = 'Enter your content here...',
  className = ''
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    onContentChange(value);
  };

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const handleMarkdownFormatting = (format: string) => {
    const textarea = document.getElementById('rich-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let newText = '';

    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          newText = `[${selectedText}](${url})`;
        } else {
          return;
        }
        break;
      case 'list':
        newText = `- ${selectedText}`;
        break;
      default:
        newText = selectedText;
    }

    const updatedContent = content.substring(0, start) + newText + content.substring(end);
    setContent(updatedContent);
    onContentChange(updatedContent);
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="border-b border-gray-200">
        <div className="flex items-center space-x-1 p-2">
          <button
            type="button"
            onClick={() => handleMarkdownFormatting('bold')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Bold"
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            onClick={() => handleMarkdownFormatting('italic')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Italic"
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            onClick={() => handleMarkdownFormatting('heading')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Heading"
          >
            <span className="font-bold text-sm">#</span>
          </button>
          <button
            type="button"
            onClick={() => handleMarkdownFormatting('link')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Insert Link"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleMarkdownFormatting('list')}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Bullet List"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <textarea
          id="rich-textarea"
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full border-0 focus:ring-0 focus:outline-none sm:text-sm min-h-[200px]"
          rows={8}
        />
      </div>

      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Supports Markdown formatting: **bold**, *italic*, [links](url), # headings
          </div>
          <div className="text-xs text-gray-500">
            {content.length} characters
          </div>
        </div>
      </div>
    </div>
  );
}