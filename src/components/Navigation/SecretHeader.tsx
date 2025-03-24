"use client";
import Link from "next/link";
import { Home } from "react-feather";
import ProfileDropdown from "@/components/Navigation/ProfileDropdown"

const Header: React.FC = () => {


  return (
    <>
     <nav
    className="w-full md:flex-row md:flex-nowrap md:justify-start flex items-center mb-4 bg-gray-200 py-4"
  >
    <div
      className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4"
    >
      <div className="md:flex hidden flex-row flex-wrap items-center mr-3">
        <Link href="/" className="flex items-center"
          >
          <Home size="14" className="mr-2" />Trang Blog</Link>
      </div>
      <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
        <ProfileDropdown />
      </ul>
    </div>
  </nav>
    </>
  );
};

export default Header;
