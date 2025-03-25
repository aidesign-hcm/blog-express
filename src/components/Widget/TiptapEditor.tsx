"use client";

import React, { useCallback, useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import styles from "@/components/Widget/TiptapEditor.module.scss";
import mediaApiRequest from "@/apiRequests/media";
import { toast } from "react-toastify";
import envConfig from "@/config";

interface TiptapEditorProps {
  value: string;
  onChange: (content: string) => void;
  characterLimit?: number;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  characterLimit = 20000,
}) => {
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: characterLimit }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link,
      Highlight,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  const addImage = () => {
    const url = window.prompt("Enter image URL");

    if (url) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
        })
        .run();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImg(file);
    }
  };

  const onUploadImg = async (file: File) => {
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    try {
      const baseUrl = envConfig?.NEXT_PUBLIC_API_ENDPOINT || "";
      const data = new FormData();
      data.append("imageFile", file);
      const sessionToken = localStorage.getItem("sessionToken") || "";
      const result = await mediaApiRequest.postMedia(data, sessionToken);
      const url = result?.payload?.featureImg?.path;
      if (url) {

        toast.success("Đăng hình ảnh thành công.");
        if (editor) {
          editor.chain().focus().setImage({ src: `${baseUrl}/${url}`}).run();
        }
      } else {
        toast.error("Upload failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast.error(
        "An error occurred while uploading the image. Please try again."
      );
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const characterCount = editor.storage.characterCount.characters();
  const percentage = (characterCount / characterLimit) * 100;

  return (
    <div className={styles.content}>
      <div className="content tiptap-block border-2 border-gray-700 rounded p-4">
        {/* Bubble Menu */}
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="bubble-menu">
              <span
                className={`${editor.isActive("bold") ? "is-active" : ""}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                Đậm
              </span>
              <span
                className={`${editor.isActive("italic") ? "is-active" : ""}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                Nghiêng
              </span>
              <span
                className={`${editor.isActive("strike") ? "is-active" : ""}`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                Gạch ngang
              </span>
              <span onClick={() => editor.chain().focus().unsetLink().run()}>
                Xóa Link
              </span>
              <span
                className={editor.isActive("link") ? "is-active" : ""}
                onClick={() => {
                  const url = prompt("Enter link URL:");
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
              >
                Link
              </span>
            </div>
          </BubbleMenu>
        )}

        {/* Toolbar Buttons */}
        <div className="toolbar mb-4">
          <span
            className={editor.isActive("paragraph") ? "is-active" : ""}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Đoạn
          </span>
          <span
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </span>
          <span
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </span>
          <span
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H3
          </span>
          <span
            className={
              editor.isActive("heading", { level: 4 }) ? "is-active" : ""
            }
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H4
          </span>
          <span
            className={
              editor.isActive("bulletList") ? "is-active flex" : "flex"
            }
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <circle cx="5" cy="6" r="2" fill="black" />
              <circle cx="5" cy="12" r="2" fill="black" />
              <circle cx="5" cy="18" r="2" fill="black" />
              <rect x="9" y="5" width="10" height="2" fill="black" />
              <rect x="9" y="11" width="10" height="2" fill="black" />
              <rect x="9" y="17" width="10" height="2" fill="black" />
            </svg>
          </span>
          <span
            className={editor.isActive("orderedList") ? "is-active" : ""}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <text x="4" y="7" fontSize="6" fill="black">
                1.
              </text>
              <text x="4" y="13" fontSize="6" fill="black">
                2.
              </text>
              <text x="4" y="19" fontSize="6" fill="black">
                3.
              </text>
              <rect x="12" y="5" width="10" height="2" fill="black" />
              <rect x="12" y="11" width="10" height="2" fill="black" />
              <rect x="12" y="17" width="10" height="2" fill="black" />
            </svg>
          </span>

          <span
            className={editor.isActive("highlight") ? "is-active" : ""}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Highlight
          </span>
          <span
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <rect x="3" y="5" width="16" height="2" fill="black" />
              <rect x="3" y="11" width="12" height="2" fill="black" />
              <rect x="3" y="17" width="16" height="2" fill="black" />
            </svg>
          </span>
          <span
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <rect x="5" y="5" width="14" height="2" fill="black" />
              <rect x="7" y="11" width="10" height="2" fill="black" />
              <rect x="5" y="17" width="14" height="2" fill="black" />
            </svg>
          </span>
          <span
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <rect x="5" y="5" width="16" height="2" fill="black" />
              <rect x="9" y="11" width="12" height="2" fill="black" />
              <rect x="5" y="17" width="16" height="2" fill="black" />
            </svg>
          </span>
          <span
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <path
                d="M6 9L3 12L6 15"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 12H14C17.3137 12 20 14.6863 20 18V18"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-flex"
            >
              <path
                d="M18 9L21 12L18 15"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H10C6.68629 12 4 14.6863 4 18V18"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          {/* <span onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            Clear Marks
          </span>
          <span onClick={() => editor.chain().focus().clearNodes().run()}>
            Clear Nodes
          </span> */}
          <span onClick={addImage}>Thêm Ảnh URL</span>
          <div>
            <input
              type="file"
              id="upload"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <span onClick={() => document.getElementById("upload")?.click()}>
              Upload Ảnh
            </span>
          </div>
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} />

        {/* Character Count */}
        <div className="character-count mt-4 border-t pt-2">
          <svg
            height="20"
            width="20"
            viewBox="0 0 20 20"
            className="character-count__graph"
          >
            <circle r="10" cx="10" cy="10" fill="#e9ecef" />
            <circle
              r="5"
              cx="10"
              cy="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${percentage} 100`}
              transform="rotate(-90) translate(-20)"
            />
          </svg>
          <div>
            {characterCount}/{characterLimit} characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
