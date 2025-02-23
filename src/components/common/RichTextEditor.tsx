// RichTextEditor.tsx
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill's default CSS
import "./RichTextEditor.css"; // Custom styles if needed

export interface RichTextEditorProps{
    onChange:  React.Dispatch<React.SetStateAction<string>>;
    value: string;
}
const RichTextEditor: React.FC<RichTextEditorProps> = ({onChange, value}) => {


    const modules = {
        toolbar: [
            ["bold", "italic", "underline"], // Basic text styling
            [{ list: "ordered" }, { list: "bullet" }], // Lists
        ],
    };

    const formats = [
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
    ];

    return (
        <div className="relative p-0 bg-gray-100 rounded-[10px] w-full mx-auto">
            <p className="absolute right-9 text-[#6438C2] mt-4 text-right text-[16px]">{value ? value.length : 0}/500</p>
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Start typing..."
                className="rounded-[10px] max-h-[356px] font-lato font-light bg-[#F7F8FA]"
            />
        </div>
    );
};

export default RichTextEditor;
