"use client";

import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Menu, X } from "react-feather";
import BottomMenu from "@/components/Navigation/BottomMenu";
import SideMobileMenu from "@/components/Navigation/SideMobileMenu";
import { useAppContext } from "@/app/app-provider";
import SearchNormal from "@/components/Navigation/SearchNormal";
import ProfileDropdown from "@/components/Navigation/ProfileDropdown";
import Logo from "./Navigation/Logo";

const Header: React.FC = () => {
  const { user } = useAppContext();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.style.position = "relative";
    document.body.style.overflowY = "auto";

    // Function to check if the screen width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [pathname]);

  const getVietnamDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    };
    return new Intl.DateTimeFormat("vi-VN", options).format(date);
  };

  const isPrivateRoute = pathname.startsWith("/dashboard");

  return (
    <>
      {!isPrivateRoute && (
        <nav
          id="top-nav"
          className={`bg-white dark:bg-gray-900 w-full z-20 border-b border-gray-200 dark:border-gray-600 ${
            isMobile ? "" : ""
          }`}
        >
          <div className="container flex flex-wrap items-center justify-between mx-auto py-2 px-2">
            <Logo />
            <span className="md:block hidden text-gray-500">{getVietnamDate()}</span>
            <div className="w-1/3 hidden md:block"></div>
            <div className="right-block flex menu-search items-center">
             

              <span className="md:hidden block">
                <Link href="/login" aria-label="Login" type="button" className="user flex gap-1 items-center ml-2">
                  <User size="18" />
                </Link>
              </span>
              <span className="md:block hidden ml-2">
                {user ? (
                  <ProfileDropdown />
                ) : (
                  <Link href="/login" aria-label="Login" type="button" className="user flex gap-1 items-center ml-2">
                    Đăng Nhập
                  </Link>
                )}
              </span>

              <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <div className="drawer ml-2 block md:hidden">
                  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label htmlFor="my-drawer" className="cursor-pointer">
                      <Menu />
                    </label>
                  </div>
                  <div className="drawer-side z-50 overflow-y-auto">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="menu bg-base-200 text-base-content min-h-full md:w-2/3 lg:w-1/2 w-full p-4">
                      <label
                        htmlFor="my-drawer"
                        aria-label="close sidebar"
                        className="fixed right-2 top-2 w-8 h-8 bg-white rounded-full shadow-md pointer flex items-center justify-center"
                      >
                        <X />
                      </label>
                      <SearchNormal />
                      <SideMobileMenu />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BottomMenu />
          
        </nav>
      )}
    </>
  );
};

export default Header;
