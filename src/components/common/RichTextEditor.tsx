// RichTextEditor.tsx
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import "./RichTextEditor.css";
export interface RichTextEditorProps {
  onChange: (content: string) => void;
  value: string;
  disabled?: boolean;
  className?: string;
}
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  onChange,
  value,
  disabled,
  className,
}) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      //line-height
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const formats = ["bold", "italic", "underline", "list", "bullet"];

  return (
    <div
      className="relative mx-auto w-full rounded-[10px] bg-gray-100 p-0"
      onContextMenu={(e) => e.preventDefault()}
    >
      <ReactQuill
        value={value}
        onChange={(content) => onChange(content)} // Always wrap
        modules={modules}
        formats={formats}
        placeholder="Start typing..."
        readOnly={disabled || false} // Default to false if undefined
        className={
          className
            ? className
            : "font-lato max-h-[356px] rounded-[10px] bg-[#FFFFFF] font-light"
        }
      />
    </div>
  );
};

export default RichTextEditor;
