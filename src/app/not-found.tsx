import Link from "next/link";

export default function Custom404() {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mt-2">Oops! This page doesn't exist.</p>
        <Link href="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Về Trang Chủ
        </Link>
      </div>
    );
  }
  