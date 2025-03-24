import React from "react";
import { Loader } from "react-feather";

const LoadingTime = () => {
  return (
    <div className="container mx-auto py-8">
    <div className="block">
      <div className="flex items-center justify-center rounded-lg h-96">
        <div role="status">
          <Loader className="animate-spin" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default LoadingTime;
