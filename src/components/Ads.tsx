"use client";
import React from "react";
import { useSetting } from "@/context/SettingContext";

const Ads = () => {
  const { setting } = useSetting();
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: setting?.ads1 }} />
    </>
  );
};

export default Ads;
