"use client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const PlaceholderDocument = () => {
  const router = useRouter();

  const handleClick = () => {
    // check if user is FREE tier and if theyre over the file limmit, push to upgrade page
    router.push("/dashboard/upload");
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-xl gap-y-1 bg-gray-200 drop-shadow-md text-gray-400"
    >
      <PlusCircleIcon className="h-16 w-16" />
      <p>Add a document</p>
    </Button>
  );
};

export default PlaceholderDocument;
