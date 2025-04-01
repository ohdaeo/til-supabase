import { CreateEditor } from "@/components/editor/create-editor";
import React from "react";

const page = () => {
  return (
    <div className="w-[920px] h-screen bg-[#f9f9f9] border-r border-r-[#d6d6d6] flex items-start justify-center">
      <CreateEditor />
    </div>
  );
};

export default page;
