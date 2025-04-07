"use client";

import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { HexColorPicker } from "react-colorful";

interface HighlightPickerProps {
  editor: Editor | null;
}

const suggestedColors = [
  "#fb7185", // Pink
  "#fdb874", // Orange
  "#d9f99d", // Light Green
  "#a7f3d0", // Mint Green
  "#a5f3fc", // Light Blue
  "#a5b4fc", // Purple
];

const HighlightPicker: React.FC<HighlightPickerProps> = ({ editor }) => {
    const [color, setColor] = useState<string>("#ffff00"); // Default yellow highlight

    if (!editor) return null;
  
    const applyHighlight = (newColor: string | null) => {
      setColor(newColor || "#ffff00"); // Reset to yellow if null
      if (newColor) {
        editor.chain().focus().setHighlight({ color: newColor }).run();
      } else {
        editor.chain().focus().unsetHighlight().run();
      }
    };

  return (
    <details className="dropdown">
      <summary  className="text-gray-400 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-highlighter w-4 h-4"
        >
          <path d="m9 11-6 6v3h9l3-3"></path>
          <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path>
        </svg>
      </summary>
      <div
        tabIndex={3}
        className="dropdown-content card bg-black rounded-box z-10 p-2 shadow-md"
      >
        <HexColorPicker className="z-20" color={color} onChange={applyHighlight} />
        <input
          type="text"
          value={color}
          onChange={(e) => applyHighlight(e.target.value)}
          className="w-full p-1 rounded mt-2 text-white bg-black"
        />
        <div className="flex flex-wrap items-center gap-2 max-w-[15rem] mt-2">
          {suggestedColors.map((clr) => (
            <span
              key={clr}
              className="flex items-center justify-center p-1.5 rounded group hover:bg-neutral-100"
              onClick={() => applyHighlight(clr)}
            >
              <div
                className="w-6 h-6 rounded shadow-sm ring-offset-2 ring-current hover:ring-1"
                style={{ backgroundColor: clr }}
              ></div>
            </span>
          ))}
          <span
            className="flex items-center justify-center border text-sm font-semibold rounded-md bg-transparent border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-black/5 hover:text-neutral-700 h-8 px-2"
            onClick={() => applyHighlight(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-undo w-4 h-4"
            >
              <path d="M3 7v6h6"></path>
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
            </svg>
          </span>
        </div>
      </div>
    </details>
  );
};

export default HighlightPicker;
