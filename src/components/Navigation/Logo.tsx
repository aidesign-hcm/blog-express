import Image from "next/image";
import Link from "next/link";
import { useSetting } from "@/context/SettingContext";
import envConfig from "@/config";

const LogoComponent = () => {
  const { setting } = useSetting();

  return (
    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
      {setting?.logo?.path ? (
        <Image
          src={`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/${setting.logo.path}`}
          alt="Site Logo"
          width={100}
          height={50}
          quality={80}
          priority={true}
          className="max-w-32"
        />
      ) : (
        <span className="h-6 w-24 bg-gray-200 rounded py-2"></span>
      )}
    </Link>
  );
};

export default LogoComponent;
