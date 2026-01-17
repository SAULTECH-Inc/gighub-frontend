// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   Bold,
//   Italic,
//   Underline,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   List,
//   ListOrdered,
//   Quote,
//   Code,
//   Link,
//   Image,
//   Heading1,
//   Heading2,
//   Heading3,
//   Subscript,
//   Superscript,
//   Highlighter,
//   FileText,
//   FlaskConical,
//   BookOpen,
//   Settings,
//   Undo,
//   Redo,
//   Scissors,
//   Copy,
//   Clipboard
// } from 'lucide-react';
//
// // Toolbar configurations
// const toolbarSets = {
//   basic: ['undo', 'redo', '|', 'cut', 'copy', 'paste', '|', 'bold', 'italic', 'underline', 'alignLeft', 'alignCenter', 'alignRight'],
//   writer: ['undo', 'redo', '|', 'cut', 'copy', 'paste', '|', 'bold', 'italic', 'underline', 'heading1', 'heading2', 'heading3', 'quote', 'list', 'listOrdered', 'link'],
//   scientist: ['undo', 'redo', '|', 'cut', 'copy', 'paste', '|', 'bold', 'italic', 'underline', 'subscript', 'superscript', 'code', 'quote', 'list', 'listOrdered'],
//   researcher: ['undo', 'redo', '|', 'cut', 'copy', 'paste', '|', 'bold', 'italic', 'underline', 'highlight', 'quote', 'code', 'link', 'list', 'listOrdered', 'heading1', 'heading2']
// };
//
// const toolIcons = {
//   bold: Bold,
//   italic: Italic,
//   underline: Underline,
//   alignLeft: AlignLeft,
//   alignCenter: AlignCenter,
//   alignRight: AlignRight,
//   list: List,
//   listOrdered: ListOrdered,
//   quote: Quote,
//   code: Code,
//   link: Link,
//   image: Image,
//   heading1: Heading1,
//   heading2: Heading2,
//   heading3: Heading3,
//   subscript: Subscript,
//   superscript: Superscript,
//   highlight: Highlighter,
//   undo: Undo,
//   redo: Redo,
//   cut: Scissors,
//   copy: Copy,
//   paste: Clipboard
// };
//
// const toolbarSetIcons = {
//   basic: FileText,
//   writer: BookOpen,
//   scientist: FlaskConical,
//   researcher: Settings
// };
//
// // Helper functions for JSON tree manipulation
// const wrapSelection = (jsonTree: any, wrapperType: any) => {
//   if (typeof jsonTree === 'string') {
//     return { [wrapperType]: jsonTree };
//   }
//
//   if (typeof jsonTree === 'object' && jsonTree !== null) {
//     return { [wrapperType]: jsonTree };
//   }
//
//   return jsonTree;
// };
//
// const unwrapSelection = (jsonTree: any, wrapperType: any) => {
//   if (typeof jsonTree === 'object' && jsonTree !== null && jsonTree[wrapperType]) {
//     return jsonTree[wrapperType];
//   }
//   return jsonTree;
// };
//
// const hasWrapper = (jsonTree: any, wrapperType: any) => {
//   if (typeof jsonTree === 'object' && jsonTree !== null) {
//     return Object.prototype.hasOwnProperty.call(jsonTree, wrapperType);
//   }
//   return false;
// };
//
// interface GTextEditorProp{
//   placeholder?: string;
//   className?: string;
//   value: string;
//   onChange: (value: any)=>void;
//   disabled?: boolean;
//   required?: boolean;
// }
//
// const GTextEditor: React.FC<GTextEditorProp> = ({
//                           placeholder = "Start typing...",
//                           className = "",
//                           value = "",
//                           onChange,
//                           disabled = false,
//                           required = false
//                         }) => {
//   // Convert JSON tree to display text
//   const jsonToText = useCallback((obj: any) => {
//     if (typeof obj === 'string') return obj;
//     if (typeof obj === 'object' && obj !== null) {
//       const keys = Object.keys(obj);
//       if (keys.length === 1) {
//         return jsonToText(obj[keys[0]]);
//       }
//     }
//     return '';
//   }, []);
//
//   const [content, setContent] = useState(() => {
//     try {
//       return value ? JSON.parse(value) : { p: "" };
//     } catch {
//       return { p: value || "" };
//     }
//   });
//
//   const [toolbarSet, setToolbarSet] = useState('basic');
//   const [selection, setSelection] = useState({ start: 0, end: 0 });
//   const [, setActiveFormats] = useState(new Set());
//   const [history, setHistory] = useState<any[]>([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
//   const [clipboard, setClipboard] = useState('');
//   const editorRef = useRef(null);
//   const [showToolbarSelector, setShowToolbarSelector] = useState(false);
//
//   // Initialize history with initial content
//   useEffect(() => {
//     if (history.length === 0) {
//       setHistory([content]);
//       setHistoryIndex(0);
//     }
//   }, [content, history.length]);
//
//   // Add to history
//   const addToHistory = useCallback((newContent: any) => {
//     setHistory(prev => {
//       const newHistory = prev.slice(0, historyIndex + 1);
//       newHistory.push(newContent);
//       // Limit history to 50 items
//       if (newHistory.length > 50) {
//         newHistory.shift();
//         return newHistory;
//       }
//       return newHistory;
//     });
//     setHistoryIndex(prev => prev + 1);
//   }, [historyIndex]);
//
//   // Undo function
//   const undo = useCallback(() => {
//     if (historyIndex > 0) {
//       const newIndex = historyIndex - 1;
//       setHistoryIndex(newIndex);
//       setContent(history[newIndex]);
//     }
//   }, [historyIndex, history]);
//
//   // Redo function
//   const redo = useCallback(() => {
//     if (historyIndex < history.length - 1) {
//       const newIndex = historyIndex + 1;
//       setHistoryIndex(newIndex);
//       setContent(history[newIndex]);
//     }
//   }, [historyIndex, history]);
//
//   // Cut function
//   const cut = useCallback(() => {
//     if (editorRef.current && selection.start !== selection.end) {
//       const text = jsonToText(content);
//       const selectedText = text.substring(selection.start, selection.end);
//       setClipboard(selectedText);
//
//       // Remove selected text
//       const newText = text.substring(0, selection.start) + text.substring(selection.end);
//       const newContent = { p: newText };
//       setContent(newContent);
//       addToHistory(newContent);
//
//       // Update cursor position
//       setTimeout(() => {
//         if (editorRef.current) {
//           editorRef.current.selectionStart = selection.start;
//           editorRef.current.selectionEnd = selection.start;
//         }
//       }, 0);
//     }
//   }, [content, selection, jsonToText, addToHistory]);
//
//   // Copy function
//   const copy = useCallback(() => {
//     if (editorRef.current && selection.start !== selection.end) {
//       const text = jsonToText(content);
//       const selectedText = text.substring(selection.start, selection.end);
//       setClipboard(selectedText);
//
//       // Try to use browser clipboard API if available
//       if (navigator.clipboard) {
//         navigator.clipboard.writeText(selectedText).catch(() => {
//           // Fallback handled by our internal clipboard
//         });
//       }
//     }
//   }, [content, selection, jsonToText]);
//
//   // Paste function
//   const paste = useCallback(() => {
//     if (editorRef.current) {
//       const text = jsonToText(content);
//       const beforeCursor = text.substring(0, selection.start);
//       const afterCursor = text.substring(selection.end);
//       const newText = beforeCursor + clipboard + afterCursor;
//       const newContent = { p: newText };
//       setContent(newContent);
//       addToHistory(newContent);
//
//       // Update cursor position
//       const newCursorPos = beforeCursor.length + clipboard.length;
//       setTimeout(() => {
//         if (editorRef.current) {
//           editorRef.current.selectionStart = newCursorPos;
//           editorRef.current.selectionEnd = newCursorPos;
//         }
//       }, 0);
//     }
//   }, [content, selection, clipboard, jsonToText, addToHistory]);
//
//   // Handle keyboard shortcuts
//   const handleKeyDown = useCallback((e: any) => {
//     if (disabled) return;
//
//     if (e.ctrlKey || e.metaKey) {
//       switch (e.key) {
//         case 'z':
//           e.preventDefault();
//           if (e.shiftKey) {
//             redo();
//           } else {
//             undo();
//           }
//           break;
//         case 'y':
//           e.preventDefault();
//           redo();
//           break;
//         case 'x':
//           e.preventDefault();
//           cut();
//           break;
//         case 'c':
//           e.preventDefault();
//           copy();
//           break;
//         case 'v':
//           e.preventDefault();
//           // Try to get from browser clipboard first
//           if (navigator.clipboard) {
//             navigator.clipboard.readText().then(text => {
//               if (text) {
//                 setClipboard(text);
//                 const currentText = jsonToText(content);
//                 const beforeCursor = currentText.substring(0, selection.start);
//                 const afterCursor = currentText.substring(selection.end);
//                 const newText = beforeCursor + text + afterCursor;
//                 const newContent = { p: newText };
//                 setContent(newContent);
//                 addToHistory(newContent);
//               }
//             }).catch(() => {
//               // Fallback to internal clipboard
//               paste();
//             });
//           } else {
//             paste();
//           }
//           break;
//       }
//     }
//   }, [disabled, undo, redo, cut, copy, paste, content, selection, jsonToText, addToHistory]);
//
//   // Update parent component
//   useEffect(() => {
//     const textValue = jsonToText(content);
//     const jsonValue = JSON.stringify(content);
//     onChange?.({ key: 'json', value: jsonValue });
//   }, [content, onChange, jsonToText]);
//
//   const handleTextChange = useCallback((e) => {
//     if (disabled) return;
//
//     const newText = e.target.value;
//     const newContent = { p: newText };
//     setContent(newContent);
//
//     // Add to history with debouncing
//     const timeoutId = setTimeout(() => {
//       addToHistory(newContent);
//     }, 500);
//
//     return () => clearTimeout(timeoutId);
//   }, [disabled, addToHistory]);
//
//   const handleSelectionChange = () => {
//     if (editorRef.current) {
//       const start = editorRef.current.selectionStart;
//       const end = editorRef.current.selectionEnd;
//       setSelection({ start, end });
//     }
//   };
//
//   const applyFormat = (formatType) => {
//     if (disabled) return;
//
//     // Handle special toolbar actions
//     switch (formatType) {
//       case 'undo':
//         undo();
//         return;
//       case 'redo':
//         redo();
//         return;
//       case 'cut':
//         cut();
//         return;
//       case 'copy':
//         copy();
//         return;
//       case 'paste':
//         paste();
//         return;
//     }
//
//     const isActive = hasWrapper(content, formatType);
//     let newContent;
//
//     if (isActive) {
//       // Remove format
//       newContent = unwrapSelection(content, formatType);
//       setActiveFormats(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(formatType);
//         return newSet;
//       });
//     } else {
//       // Apply format
//       newContent = wrapSelection(content, formatType);
//       setActiveFormats(prev => new Set([...prev, formatType]));
//     }
//
//     setContent(newContent);
//     addToHistory(newContent);
//   };
//
//   const renderToolbar = () => {
//     const tools = toolbarSets[toolbarSet] || toolbarSets.basic;
//
//     return (
//       <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 relative">
//         <div className="flex items-center gap-1 mr-4 relative">
//           <button
//             type="button"
//             onClick={() => setShowToolbarSelector(!showToolbarSelector)}
//             className="p-2 hover:bg-gray-200 rounded flex items-center gap-1 text-sm"
//             title="Select Toolbar Set"
//           >
//             {React.createElement(toolbarSetIcons[toolbarSet], { size: 16 })}
//             <span className="capitalize">{toolbarSet}</span>
//           </button>
//
//           {showToolbarSelector && (
//             <div className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg">
//               {Object.keys(toolbarSets).map((set) => (
//                 <button
//                   key={set}
//                   type="button"
//                   onClick={() => {
//                     setToolbarSet(set);
//                     setShowToolbarSelector(false);
//                   }}
//                   className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left capitalize"
//                 >
//                   {React.createElement(toolbarSetIcons[set], { size: 16 })}
//                   {set}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//
//         <div className="h-6 w-px bg-gray-300 mx-2"></div>
//
//         {tools.map((tool: any, index: number) => {
//           // Handle separators
//           if (tool === '|') {
//             return <div key={`separator-${index}`} className="h-6 w-px bg-gray-300 mx-1"></div>;
//           }
//
//           const Icon = toolIcons[tool];
//           const isActive = hasWrapper(content, tool);
//
//           // Special handling for undo/redo states
//           let isDisabled = disabled;
//           if (tool === 'undo') {
//             isDisabled = disabled || historyIndex <= 0;
//           } else if (tool === 'redo') {
//             isDisabled = disabled || historyIndex >= history.length - 1;
//           } else if (tool === 'cut' || tool === 'copy') {
//             isDisabled = disabled || selection.start === selection.end;
//           } else if (tool === 'paste') {
//             isDisabled = disabled || !clipboard;
//           }
//
//           return (
//             <button
//               key={tool}
//               type="button"
//               onClick={() => applyFormat(tool)}
//               className={`p-2 rounded hover:bg-gray-200 ${
//                 isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
//               } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//               title={tool.charAt(0).toUpperCase() + tool.slice(1)}
//               disabled={isDisabled}
//             >
//               <Icon size={16} />
//             </button>
//           );
//         })}
//       </div>
//     );
//   };
//
//   const displayText = jsonToText(content);
//
//   return (
//     <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
//       {renderToolbar()}
//
//       <div className="relative">
//         <textarea
//           ref={editorRef}
//           value={displayText}
//           onChange={handleTextChange}
//           onSelect={handleSelectionChange}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//           disabled={disabled}
//           required={required}
//           className="w-full p-4 min-h-48 resize-none outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
//           style={{ fontFamily: 'inherit' }}
//         />
//       </div>
//
//       {/* JSON Preview */}
//       <div className="border-t border-gray-200 p-3 bg-gray-50">
//         <div className="text-xs text-gray-500 mb-1">JSON Output:</div>
//         <pre className="text-xs text-gray-600 font-mono bg-white p-2 rounded border overflow-x-auto">
//           {JSON.stringify(content, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// };
//
// export default GTextEditor;
