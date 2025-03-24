import type { Metadata } from "next";
import "../styles/global.css";
import { Inter, Libre_Baskerville } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppProvider from "@/app/app-provider";
import NextTopLoader from "nextjs-toploader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SettingProvider } from "@/context/SettingContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const libre_baskerville = Libre_Baskerville({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
  variable: "--libre-baskerville",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Báo VnExpress - Báo tiếng Việt nhiều người xem nhất",
  description:
    "VnExpress tin tức mới nhất - Thông tin nhanh &amp; chính xác được cập nhật hàng giờ. Đọc báo tin tức online Việt Nam &amp; Thế giới nóng nhất trong ngày về thể thao, thời sự, pháp luật, kinh doanh,...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${libre_baskerville.className}`}
      data-theme="light"
    >
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimal-ui, shrink-to-fit=no, viewport-fit=cover" />
      <head>
        <meta name="application-name" content="" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="Báo VnExpress - Báo tiếng Việt nhiều người xem nhất"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="overflow-x-hidden antialiased w-screen">
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
          <AppProvider>
          <SettingProvider>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Header />
            <div className="main dark:bg-gray-900 text-gray-800 dark:text-white">
              <NextTopLoader />
              {children}
            </div>
            <Footer />
            </SettingProvider>
          </AppProvider>
        </GoogleOAuthProvider>
      </body>
   
    </html>
  );
}
