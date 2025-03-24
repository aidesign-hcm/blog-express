"use client";
import { createContext, useContext, useEffect, useState } from "react";
import settingApiRequest from "@/apiRequests/common";
import { usePathname } from "next/navigation"; 

interface Setting {
  title: string;
  desc: string;
  address: string;
  email: string;
  hotline: string;
  contact: string;
  copyright: string;
  footerBLock1: string;
  footerBLock2: string;
}

interface Menu {
  title: string;
  position: string;
  obj: object;
}

interface SettingContextType {
  setting: Setting | null;
  loading: boolean;
  menus: Menu | null;
}

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [menus, setMenus] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // Get current route

  useEffect(() => {
    const storedSetting = localStorage.getItem("siteSetting");
    const storedMenus = localStorage.getItem("siteMenus");
    const hasStoredData = storedSetting && storedMenus;

    if (hasStoredData) {
      setSetting(JSON.parse(storedSetting!));
      setMenus(JSON.parse(storedMenus!));
      setLoading(false);
    }

    // Always fetch settings if on homepage OR if no stored data exists
    if (!hasStoredData || pathname === "/") {
      const fetchSetting = async () => {
        try {
          const resSetting = await settingApiRequest.commonFetchSetting();
          if (resSetting.payload.success) {
            setSetting(resSetting.payload.setting);
            setMenus(resSetting.payload.menus);

            // Store settings in localStorage
            localStorage.setItem("siteSetting", JSON.stringify(resSetting.payload.setting));
            localStorage.setItem("siteMenus", JSON.stringify(resSetting.payload.menus));
          } else {
            console.error("Failed to fetch settings");
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchSetting();
    }
  }, [pathname]); // Fetch on route change

  return (
    <SettingContext.Provider value={{ setting, loading, menus }}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
};
