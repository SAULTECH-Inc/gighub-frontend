import RichTextEditor, {RichTextEditorProps} from "./RichTextEditor.tsx";
import React from "react";

const TextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange
                                                   })=> {
    return (<div className="relative w-full">
        <RichTextEditor value={value} onChange={onChange}/>

    </div>);
}

export default TextEditor;