"use client";
// pages/profile.tsx
import { useAppContext } from "@/app/app-provider";

const Profile = () => {
  const { user, isAuthenticated } = useAppContext();
  return (
    <>
      <h1 className="text-2xl">Tổng Quan </h1>
      {user && (
        <ul>
          <li>Tên: {user.username}</li>
          <li>Email: {user.email}</li> 
        </ul>
      )}
    </>
  );
};

export default Profile;
