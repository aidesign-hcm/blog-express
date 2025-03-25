"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Navigation/Logo";
import ButtonLogout from "./ui/button-logout";
import { useAuth } from "@/hooks/useAuth";

export default function Logout() {
  const { hasPermission } = useAuth();
  const pathname = usePathname();
  const isSecretRoute = pathname.startsWith("/dashboard/secret");
 
  const secretMenu = [
    {
      title: "Tin Tức",
      href: "/dashboard/secret/blog",
      children: [
        { title: "Tin Tức", href: "/dashboard/secret/blog" },
        { title: "Thêm Tin Tức", href: "/dashboard/secret/blog/add" },
      ],
    },
    {
      title: "Danh Mục",
      href: "/dashboard/secret/categories",
      children: [
        { title: "Quản Lý Danh Mục", href: "/dashboard/secret/categories" },
        { title: "Thêm Danh Mục", href: "/dashboard/secret/categories/add" },
      ],
    },
    {
      title: "Thành Viên",
      href: "/dashboard/secret/user",
      children: [
        { title: "Quản Lý Thành Viên", href: "/dashboard/secret/user" },
        { title: "Thêm Thành Viên", href: "/dashboard/secret/user/add" },
        { title: "Nhập File CSV", href: "/dashboard/secret/user/import" },
      ],
    },
    {
      title: "Menu",
      href: "/dashboard/secret/menu",
      children: [
        { title: "Quản Lý Menu", href: "/dashboard/secret/menu" },
        { title: "Thêm menu", href: "/dashboard/secret/menu/add" },
      ],
    },
    {
      title: "Cài đặt",
      href: "/dashboard/secret/setting",
    },
  ];
  const generalMenu = [
    { title: "Tài khoản", href: "/dashboard" },
    { title: "Chỉnh sửa thông tin", href: "/dashboard/account" },
  ];
  const userMenu = [
    {
      title: "Tin Tức",
      href: "/dashboard/account/blog",
      children: [
        { title: "Tin Tức", href: "/dashboard/account/blog" },
        { title: "Thêm Tin Tức", href: "/dashboard/account/blog/add" },
      ],
    },
  ];
  const ManagerMenu = [
    {
      title: "Cài đặt",
      href: "/dashboard/manager/setting",
    },
    {
      title: "Quản lý tin tức",
      href: "/dashboard/manager/blog",
    },
  ];
  return (
    <>
      
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden flex flex-wrap items-center justify-between md:w-64 z-10 py-0 md:py-4 px-4 bg-gray-100">
        <div className="mx-auto block">
      <Logo />
      </div>
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {isSecretRoute ? (
            <ul className="menu">
              {secretMenu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.title}</Link>
                  {item.children && item.children.length > 0 && (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href}>{child.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li
                className={
                  pathname === "/dashboard/account"
                    ? "rounded text-blue-600"
                    : ""
                }
              >
                <Link href="/dashboard/">Truy Cập Tài Khoản</Link>
              </li>
              <li>
              <ButtonLogout />
              </li>
            </ul>
          ) : (
            <ul className="menu">
              {generalMenu.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.title}</Link>
                  {item.children && item.children.length > 0 && (
                    <ul>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href}>{child.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {hasPermission("user") &&  (
                <>
                  {userMenu.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.title}</Link>
                      {item.children && item.children.length > 0 && (
                        <ul>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href}>{child.title}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </>
              )}
              {hasPermission("manager") &&  (
                <>
                  {ManagerMenu.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.title}</Link>
                      {item.children && item.children.length > 0 && (
                        <ul>
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link href={child.href}>{child.title}</Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </>
              )}
              {hasPermission("admin") &&  (
                <li
                  className={
                    pathname === "/dashboard/secret"
                      ? "rounded text-blue-600"
                      : ""
                  }
                >
                  <Link href="/dashboard/secret">Truy Cập Quản Lý</Link>
                </li>
              )}
              <li>
              <ButtonLogout />
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}
