import React from "react";
import Link from "next/link";
import { useSetting } from "@/context/SettingContext";

const SideMobileMenu: React.FC = () => {
  const { menus } = useSetting();

  if (!menus || !Array.isArray(menus)) return null;

  const mainMenu = menus.find((menu: any) => menu.position === "0");

  if (!mainMenu || !mainMenu.obj) return null;

  const menuItems = mainMenu.obj.reduce((acc: any, item: any) => {
    acc[item.parent] = acc[item.parent] || [];
    acc[item.parent].push(item);
    return acc;
  }, {});

  // Close drawer function
  const closeDrawer = () => {
    const drawer = document.getElementById("my-drawer") as HTMLInputElement;
    if (drawer) {
      drawer.checked = false;
    }
  };

  const renderMenu = (parentId: number) => {
    if (!menuItems[parentId]) return null;

    return (
      <ul>
        {menuItems[parentId].map((item: any) => {
          const hasSubmenu = !!menuItems[item.id];

          return (
            <li key={item.id}>
              {hasSubmenu ? (
                <details>
                  <summary>{item.text}</summary>
                  {renderMenu(item.id)}
                </details>
              ) : (
                <Link href={`/${item.slug}`} onClick={closeDrawer}>
                  {item.text}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="mt-4">
      <ul className="menu bg-base-200 rounded-box w-56">{renderMenu(0)}</ul>
    </div>
  );
};

export default SideMobileMenu;
