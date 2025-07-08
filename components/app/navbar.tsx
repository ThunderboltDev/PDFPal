"use client";

import { FaUser } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAuth } from "./providers";
import ThemeSelector from "./theme-selector";

export default function Navbar() {
  const { userData } = useAuth();

  return (
    <div className="fixed top-0 left-0 w-full p-1.5 bg-bg-300/25 border-b border-bg-600 backdrop-blur-md grid grid-cols-3">
      <Button
        className="size-11"
        variant="ghost"
        size="icon"
      >
        <FaBarsStaggered className="size-5" />
      </Button>
      <Button
        variant="ghost"
        className="text-xl py-1.5 px-4 w-fit mx-auto"
      >
        SparkSight
      </Button>
      <div className="h-11 flex flex-row gap-2 justify-end">
        <ThemeSelector />
        <Button
          className="size-11 rounded-full"
          variant="ghost"
          size="icon"
        >
          {userData?.avatar ? (
            <Avatar>
              <AvatarImage
                src={userData.avatar}
                alt={`${userData.displayName}'s Avatar`}
                className="size-9"
              />
              <AvatarFallback>{userData.displayName[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <FaUser className="size-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
