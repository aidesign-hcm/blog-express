import { ChevronDown } from "lucide-react";

const DropdownMenu = ({ editor }) => {
    return (
        <div className="dropdown dropdown-center">
            <div tabIndex={0} role="button" className="text-gray-400 flex items-center">
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
                    className="lucide lucide-pilcrow w-4 h-4"
                >
                    <path d="M13 4v16"></path>
                    <path d="M17 4v16"></path>
                    <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"></path>
                </svg>
                <ChevronDown
                    className="w-3 h-3 text-gray-500 hidden md:flex"
                    size="10"
                />
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content gap-2 menu bg-black border border-neutral-800 rounded z-1 w-40 p-2 shadow-sm opacity-90"
            >
                <li>
                    <span
                        className={`text-gray-700  ${editor.isActive("paragraph") ? "is-active" : ""
                            }`}
                        onClick={() =>
                            editor.chain().focus().setParagraph().run()
                        }
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
                            className="lucide lucide-pilcrow w-4 h-4 mr-1"
                        >
                            <path d="M13 4v16"></path>
                            <path d="M17 4v16"></path>
                            <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"></path>
                        </svg>
                        Đoạn
                    </span>
                </li>
                <li>
                    <span
                        className={
                            editor.isActive("heading", { level: 1 })
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
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
                            className="lucide lucide-heading1 w-4 h-4 mr-1"
                        >
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <path d="m17 12 3-2v8"></path>
                        </svg>
                        Heading 1
                    </span>
                </li>
                <li>
                    <span
                        className={
                            editor.isActive("heading", { level: 2 })
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
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
                            className="lucide lucide-heading2 w-4 h-4 mr-1"
                        >
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"></path>
                        </svg>
                        Heading 2
                    </span>
                </li>
                <li>
                    <span
                        className={
                            editor.isActive("heading", { level: 3 })
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
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
                            className="lucide lucide-heading3 w-4 h-4 mr-1"
                        >
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"></path>
                            <path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"></path>
                        </svg>
                        Heading 3
                    </span>
                </li>
                <li>
                    <span
                        className={
                            editor.isActive("heading", { level: 4 })
                                ? "is-active"
                                : ""
                        }
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
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
                            className="lucide lucide-heading4 w-4 h-4 mr-1"
                        >
                            <path d="M4 12h8"></path>
                            <path d="M4 18V6"></path>
                            <path d="M12 18V6"></path>
                            <path d="M17 20v-8l-3 6h4"></path>
                        </svg>
                        Heading 4
                    </span>
                </li>
                <li>
                    <span
                        className={
                            editor.isActive("bulletList")
                                ? "is-active flex"
                                : "flex"
                        }
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-list w-4 h-4 mr-1"><path d="M3 12h.01"></path><path d="M3 18h.01"></path><path d="M3 6h.01"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M8 6h13"></path></svg>
                        Bullet list
                    </span>
                </li>
                <li>
                    <span
                        className={editor.isActive("orderedList") ? "is-active" : ""}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-list-ordered w-4 h-4 mr-1"><path d="M10 12h11"></path><path d="M10 18h11"></path><path d="M10 6h11"></path><path d="M4 10h2"></path><path d="M4 6h1v4"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
                        Numbered list
                    </span>
                </li>
                <li>
                    <span
                        className={editor.isActive("taskList") ? "is-active" : ""}
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-todo w-4 h-4 mr-1"><rect x="3" y="5" width="6" height="6" rx="1"></rect><path d="m3 17 2 2 4-4"></path><path d="M13 6h8"></path><path d="M13 12h8"></path><path d="M13 18h8"></path></svg>
                        Todo list
                    </span>
                </li>
            </ul>
        </div>
    );
};


export default DropdownMenu;