"use client";

import React from "react";
import Link from "next/link";
import { useSetting } from "@/context/SettingContext";

interface FooterMenuProps {
  position: string;
}

const FooterMenu: React.FC<FooterMenuProps> = ({ position }) => {
  const { menus } = useSetting();

  if (!menus || !Array.isArray(menus)) return null;

  // Find the menu that matches the given position
  const menu = menus.find((menu: any) => menu.position === position);

  if (!menu || !menu.obj || menu.obj.length === 0) return null;

  return (
    <div>
      <ul>
        {menu.obj.map((item: any) => (
          <li key={item.id} className="mb-1">
            <Link href={`/${item.slug}`}  className="hover:text-primary">
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterMenu;
