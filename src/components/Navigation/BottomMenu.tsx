import Link from "next/link";
import { useSetting } from "@/context/SettingContext";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Home } from "react-feather";
import SearchNormal from "@/components/Navigation/SearchNormal";

const BottomMenu: React.FC = () => {
  const { menus } = useSetting();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navBar = document.getElementById("nav");
      if (!navBar) return;

      const navBottom = navBar.offsetTop + navBar.offsetHeight;
      const scrollPosition = window.scrollY || window.pageYOffset;

      if (scrollPosition >= navBottom) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup listener
  }, []);

  // Show skeleton if menus are not yet loaded
  if (!menus) {
    return (
      <div className="border-t bottom-nav">
        <div className="container flex flex-wrap items-center justify-between mx-auto px-2">
          <nav
            id="nav"
            className={`w-full md:flex md:w-auto md:order-1 ${
              isSticky ? "sticky top-0 bg-white shadow-md z-50" : ""
            }`}
          >
            <ul className="flex gap-4 animate-pulse py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="h-6 w-24 bg-gray-200 rounded py-2"></li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  if (!Array.isArray(menus)) return null;

  const mainMenu = menus.find((menu: any) => menu.position === "0");
  if (!mainMenu || !mainMenu.obj) return null;

  const menuItems = mainMenu.obj.reduce((acc: any, item: any) => {
    acc[item.parent] = acc[item.parent] || [];
    acc[item.parent].push(item);
    return acc;
  }, {});

  const renderMenu = (parentId: number, isSubMenu = false) => {
    if (!menuItems[parentId]) return null;

    return (
      <ul
        className={
          isSubMenu
            ? "sub-menu dropdown-content bg-base-100 z-[1] w-52 p-2 shadow rounded border-t border-red-500"
            : "main-menu flex gap-4 items-center"
        }
      >
        {!isSubMenu && (
          <li className="my-2 cursor-pointer sticky left-0 z-10 md:w-auto bg-white">
            <Link href="/" className="block w-full">
              <span className="flex bg-gray-100 rounded-full p-2 ml-2">
                <Home size="14" />
              </span>
            </Link>
          </li>
        )}
        {menuItems[parentId].map((item: any) => (
          <li
            key={item.id}
            className={`relative my-2 cursor-pointer ${
              isSubMenu ? "hover:text-primary" : ""
            }`}
          >
            {menuItems[item.id] ? (
              <div className="dropdown dropdown-bottom dropdown-hover">
                <div tabIndex={0} className="cursor-pointer flex items-center">
                  <Link href={`/${item.slug}`} className="block w-full">
                    <span className="whitespace-nowrap">{item.text}</span>
                  </Link>
                  <ChevronDown
                    className="w-4 h-4 text-gray-500 ml-1 hidden md:flex"
                    size="12"
                  />
                </div>
                {renderMenu(item.id, true)}
              </div>
            ) : (
              <Link href={`/${item.slug}`} className="block w-full">
                <span className="whitespace-nowrap">{item.text}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      id="nav"
      className={`border-t bottom-nav ${
        isSticky ? "fixed top-0 bg-white shadow-md z-50 w-full" : ""
      }`}
    >
      <div
        className="container flex flex-nowrap items-center justify-between mx-auto px-0 md:px-2 overflow-x-scroll overflow-y-hidden md:overflow-visible"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <nav className={`w-full md:flex md:w-auto md:order-0`}>
          {renderMenu(0)}
        </nav>
        <span className="md:block hidden">
        <SearchNormal />
      </span>
      </div>
     
    </div>
  );
};

export default BottomMenu;
