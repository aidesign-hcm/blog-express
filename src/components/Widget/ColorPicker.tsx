"use client";

import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Editor } from "@tiptap/react";

interface ColorPickerProps {
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

const ColorPicker: React.FC<ColorPickerProps> = ({ editor }) => {
  const [color, setColor] = useState("#000000");

  if (!editor) return null;

  const applyColor = (newColor: string) => {
    setColor(newColor);
    editor.chain().focus().setColor(newColor).run();
  };

  return (
    <details className="dropdown">
      <summary
        tabIndex={2}
        role="button"
        className="text-gray-400 flex items-center"
      >
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
          className="lucide lucide-palette w-4 h-4"
        >
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
        </svg>
      </summary>
      <div
        tabIndex={2}
        className="dropdown-content menu bg-black rounded-box z-10 p-2 shadow-md"
      >
        {/* Color Picker */}
        <HexColorPicker color={color} onChange={applyColor} />

        {/* Color Code Input */}
        <input
          type="text"
          value={color}
          onChange={(e) => applyColor(e.target.value)}
          className="w-full p-1 rounded mt-2 text-white bg-black"
        />
        <div className="flex flex-wrap items-center gap-2 max-w-[15rem] mt-2">
          {suggestedColors.map((clr) => (
            <span
              key={clr}
              className="flex items-center justify-center p-1.5 rounded group hover:bg-neutral-100"
              onClick={() => applyColor(clr)}
            >
              <div
                className="w-3 h-3 rounded shadow-sm ring-offset-2 ring-current hover:ring-1"
                style={{ backgroundColor: clr }}
              ></div>
            </span>
          ))}
          {/* Reset Button */}
          <span
            className="flex items-center justify-center border text-sm font-semibold rounded-md bg-transparent border-transparent text-neutral-500 dark:text-neutral-400 hover:bg-black/5 hover:text-neutral-700 h-8 px-2"
            onClick={() => applyColor("#000000")}
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

export default ColorPicker;
