import { ChevronDown } from "lucide-react";

const DropdownMenu = ({ editor }) => {
  return (
    <div className="dropdown dropdown-center">
      <div
        tabIndex={4}
        role="button"
        className="text-gray-400 flex items-center text-sm"
      >
        Căn
        <ChevronDown
          className="w-3 h-3 text-gray-500 hidden md:flex"
          size="10"
        />
      </div>
      <ul
        tabIndex={4}
        className="dropdown-content gap-2 menu bg-black border border-neutral-800 rounded z-1 w-40 p-2 shadow-sm opacity-90"
      >
        <li>
          <span
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-align-left w-4 h-4"><path d="M15 12H3"></path><path d="M17 18H3"></path><path d="M21 6H3"></path></svg>
            Căn Trái
          </span>
        </li>
        <li>
          <span
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-align-right w-4 h-4"><path d="M21 12H9"></path><path d="M21 18H7"></path><path d="M21 6H3"></path></svg>
            Căn Phải
          </span>
        </li>
        <li>
          <span
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-align-center w-4 h-4"><path d="M17 12H7"></path><path d="M19 18H5"></path><path d="M21 6H3"></path></svg>
            Căn Giữa
          </span>
        </li>
        <li>
          <span
            className={
              editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
            }
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-align-justify w-4 h-4"><path d="M3 12h18"></path><path d="M3 18h18"></path><path d="M3 6h18"></path></svg>
            Căn đều
          </span>
        </li>
      </ul>
    </div>
  );
};

export default DropdownMenu;
