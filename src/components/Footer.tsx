"use client"
import React from "react";
import { Facebook, Twitter, Youtube } from "react-feather";
import FooterMenu from "@/components/Widget/FooterMenu";
import { usePathname } from "next/navigation";
import { useSetting } from "@/context/SettingContext";
import Logo from "./Navigation/Logo";

const Footer = () => {
  const { setting, menus  } = useSetting();
  const pathname = usePathname();
  const isPrivateRoute = pathname.startsWith("/dashboard");
  const menuPosition7 = menus?.find((menu: any) => menu.position === "7");
  return (
    <>
      {!isPrivateRoute && (
        <footer className="bg-white container mx-auto py-4 border-t border-gray-300 mt-4 px-4">
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6 mb-4 border-b py-8">
            {["1", "2", "3", "4", "5", "6"].map((position) => (
              <FooterMenu key={position} position={position} />
            ))}
          </div>

          <div className="copyright flex flex-wrap items-center justify-between">
            <p>
                <span className="mr-2">Báo điện tử</span>
                <Logo />
            </p>
            {menuPosition7 && (
              <div className="right flex flex-wrap gap-2">
                {menuPosition7.obj.map((item: any) => (
                  <a key={item.id} href={`/${item.slug}`} >
                    {item.text}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="copyright-footer grid md:grid-cols-3 grid-cols-1 py-4 border-t border-gray-300 my-4 pt-8 gap-4">
            {setting?.footerBLock1 && (
              <div dangerouslySetInnerHTML={{ __html: setting.footerBLock1 }} />
            )}
            {setting?.footerBLock2 && (
              <div dangerouslySetInnerHTML={{ __html: setting.footerBLock2 }} />
            )}
            <div>
              <p>{setting?.copyright || "© Your Website Name"}</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
