import type { Metadata } from "next";
import AppProvider from "@/app/app-provider";
import NextTopLoader from "nextjs-toploader";
import SideMenu from "@/components/SideMenu";
import FooterPrivate from "@/components/Widget/FooterPrivate";
import SecretHeader from "@/components/Navigation/SecretHeader"

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProvider>
      <div className="main-private">
        <SideMenu />
        <div className="relative md:ml-64 min-h-screen">
          <SecretHeader />
          <div className="relative">
            <div className="mx-auto w-full">
              <div className="rounded-md shadown-lg px-6 py-4 md:px-12">
                {children}
              </div>
              <FooterPrivate />
            </div>
          </div>
        </div>
        <NextTopLoader />
      </div>
    </AppProvider>
  );
}
