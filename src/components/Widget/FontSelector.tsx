"use client"; // Required in Next.js App Router if using hooks

import React from "react";
import { Editor } from "@tiptap/react";
import { ChevronDown } from "react-feather";

interface FontSelectorProps {
  editor: Editor | null;
}

const fonts = [
    { name: "Sans Serif (Default)", value: "sans-serif" },
    { name: "Inter", value: "Inter" },
    { name: "Arial", value: "Arial" },
    { name: "Helvetica", value: "Helvetica" },
    { name: "Serif", value: "serif" },
    { name: "Times New Roman", value: "Times New Roman" },
    { name: "Garamond", value: "Garamond" },
    { name: "Georgia", value: "Georgia" },
    { name: "Monospace", value: "monospace" },
    { name: "Courier", value: "Courier" },
    { name: "Courier New", value: "Courier New" },
  ];

const FontSelector: React.FC<FontSelectorProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="dropdown dropdown-center">
      <div
        tabIndex={1}
        role="button"
        className="text-gray-400 flex items-center"
      >
        Font
        <ChevronDown
          className="w-3 h-3 text-gray-500 hidden md:flex"
          size="10"
        />
      </div>
      <ul
        tabIndex={1}
        className="dropdown-content gap-2 menu bg-black border border-neutral-800 rounded z-1 w-40 p-2 shadow-sm opacity-90"
      >
       {fonts.map((font) => (
        <li key={font.value}>
          <span
            onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
            className={editor.getAttributes("fontFamily").fontFamily === font.value ? "is-active" : ""}
            style={{ fontFamily: font.value }}
          >
            {font.name}
          </span>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default FontSelector;
