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
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import FontFamily from "@tiptap/extension-font-family";
import FontSelector from "@/components/Widget/FontSelector";
import TextStyle from "@tiptap/extension-text-style";
import ColorPicker from "@/components/Widget/ColorPicker";
import HightLight from "@/components/Widget/HightLight";
import Color from "@tiptap/extension-color";
import StylePicker from "@/components/Widget/StylePicker";
import AlignPicker from "@/components/Widget/AlignPicker";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Video } from "@/components/Widget/EmbedVideo";
import VideoUploader from "@/components/Form/UploadViddeo";

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
  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoInputModalOpen, setIsVideoInputModalOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: characterLimit }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link,
      Highlight,
      Image,
      TaskList,
      TaskItem.configure({
        nested: true, // Allows nesting inside other task lists
      }),
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      FontFamily.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true, // Enable resizing columns
      }),
      TableRow,
      TableCell,
      TableHeader,
      Video,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  const addVideo = () => editor?.commands.setVideo(videoUrl) && closeModal();
  const openModal = () => setIsVideoInputModalOpen(true);

  const closeModal = () => setIsVideoInputModalOpen(false);

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
          editor
            .chain()
            .focus()
            .setImage({ src: `${baseUrl}/${url}` })
            .run();
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
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, maxWidth: "560px" }}
          >
            <div className="p-2 bubble-menu gap-4 items-center relative">
              <StylePicker editor={editor} />
              <AlignPicker editor={editor} />
              <FontSelector editor={editor} />
              <ColorPicker editor={editor} />
              <HightLight editor={editor} />
              <span
                className={`cursor-pointer ${
                  editor.isActive("bold") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().toggleBold().run()}
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
                  className="lucide lucide-bold w-4 h-4"
                >
                  <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path>
                </svg>
              </span>
              <span
                className={`cursor-pointer ${
                  editor.isActive("italic") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
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
                  className="lucide lucide-italic w-4 h-4"
                >
                  <line x1="19" x2="10" y1="4" y2="4"></line>
                  <line x1="14" x2="5" y1="20" y2="20"></line>
                  <line x1="15" x2="9" y1="4" y2="20"></line>
                </svg>
              </span>
              <span
                className={`cursor-pointer ${
                  editor.isActive("strike") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
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
                  className="lucide lucide-underline w-4 h-4"
                >
                  <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
                  <line x1="4" x2="20" y1="20" y2="20"></line>
                </svg>
              </span>
              <span
                className={`cursor-pointer ${
                  editor.isActive("link") ? "is-active" : ""
                }`}
                onClick={() => {
                  const url = prompt("Enter link URL:");
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }}
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
                  className="lucide lucide-link w-4 h-4"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </span>
              <span
                className={`cursor-pointer ${
                  editor.isActive("unlink") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                <svg
                  width="18"
                  height="18"
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M17 17h5v2h-3v3h-2v-5zM7 7H2V5h3V2h2v5zm11.364 8.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"></path>
                  </g>
                </svg>
              </span>

              <span
                className={`cursor-pointer ${
                  editor.isActive("bold") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().toggleCode().run()}
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
                  className="lucide lucide-code w-4 h-4"
                >
                  <path d="m16 18 6-6-6-6"></path>
                  <path d="m8 6-6 6 6 6"></path>
                </svg>
              </span>
              <span
                className={`cursor-pointer ${
                  editor.isActive("bold") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
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
                  className="lucide lucide-file-code w-4 h-4"
                >
                  <path d="M10 12.5 8 15l2 2.5"></path>
                  <path d="m14 12.5 2 2.5-2 2.5"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path>
                </svg>
              </span>
              <span
                className={`cursor-pointer ${
                  editor.isActive("bold") ? "is-active" : ""
                }`}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
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
                  className="lucide lucide-quote w-4 h-4 mr-1"
                >
                  <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                  <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
                </svg>
              </span>
            </div>
          </BubbleMenu>
        )}
        <div className="toolbar mb-4">
          <span
            className={editor.isActive("paragraph") ? "is-active" : ""}
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="16"
              height="16"
              className="inline-flex"
            >
              <path d="M13 4v16"></path>
              <path d="M17 4v16"></path>
              <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"></path>
            </svg>
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

          {/* <span
            className={editor.isActive("highlight") ? "is-active" : ""}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Highlight
          </span> */}
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
          <span onClick={() => editor.chain().focus().unsetAllMarks().run()}>
            Clear Marks
          </span>
          <span onClick={() => editor.chain().focus().clearNodes().run()}>
            Clear Nodes
          </span>
          <span
            className={`cursor-pointer ${
              editor.isActive("table") ? "is-active" : ""
            }`}
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-flex"
            >
              <path d="M3 10h18"></path>
              <path d="M10 3v18"></path>
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>
          </span>
          <span onClick={addImage}>Thêm Ảnh URL</span>
          <div className="inline-block">
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
          <span onClick={openModal}> Add Video </span>
          <div></div>
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

        {isVideoInputModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal modal-open">
              <div className="modal-box">
                <VideoUploader onUrlChange={setVideoUrl} />
                <div className="my-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <input
                      type="text"
                      placeholder="Video Url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="input w-full p-2"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-action">
                  <button className="btn btn-error" onClick={closeModal}>
                    Đóng
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={addVideo}
                    disabled={!videoUrl} // Disable the button if videoUrl is empty or null
                  >
                    Thêm Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TiptapEditor;
