import Link from "next/link";
import { useAppContext } from "@/app/app-provider";
import ButtonLogout from "../ui/button-logout";

export default function ProfileDropDown() {
  const { user, isAuthenticated } = useAppContext();
  // Define menu items
  const items = [
    {
      title: "Tài khoản",
      to: "/dashboard",
    },
    {
      title: "Tin tức",
      to: "/dashboard/account/blog",
    },
  ];


  return (
    <div className="flex-shrink-0 flex items-center justify-end">
      <div className="dropdown dropdown-end">
        <div className="tooltip tooltip-left" data-tip={user?.username}>
          <label
            tabIndex={0}
            className="cursor-pointer flex w-8 h-8 md:w-10 md:h-10 bg-yellow-400 rounded-full text-center text-gray-900 items-center justify-center text-xl mb-0 uppercase"
          >
            {user?.username?.charAt(0)}
          </label>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {items.map((item, i) => (
            <li key={i}>
              <Link href={item.to}>{item.title}</Link>
            </li>
          ))}
          <li>
            <ButtonLogout />
          </li>
        </ul>
      </div>
    </div>
  );
}
