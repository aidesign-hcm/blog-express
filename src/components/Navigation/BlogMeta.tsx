"use client";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import envConfig from "@/config";
import { useAuth } from "@/hooks/useAuth";

interface BlogMetaProps {
  createdAt: string;
  authorUsername: string;
}

export default function BlogMeta({ createdAt, authorUsername }: BlogMetaProps) {
  const { hasPermission } = useAuth();

  return (
    <div className="py-2 text-sm font-regular text-gray-900 flex">
      <span className="mr-3 flex flex-row items-center">
        <Clock size="14" />
        <span className="ml-1">
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            timeZone: "Asia/Ho_Chi_Minh",
          })}
        </span>
      </span>
      {hasPermission("user") && (
        <Link
          href={`${envConfig.NEXT_PUBLIC_URL}/author/${authorUsername}`}
          className="flex flex-row items-center hover:text-primary mr-3 text-indigo-600"
        >
          <User size="14" />
          <span className="ml-1">{authorUsername}</span>
        </Link>
      )}
    </div>
  );
}
