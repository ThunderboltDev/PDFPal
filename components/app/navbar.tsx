"use client";

import { FaUser } from "react-icons/fa";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useAuth } from "./providers";
import { SidebarTrigger } from "../ui/sidebar";
import ThemeSelector from "./theme-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const noNavPaths = [
  /^\/$/,
  /^\/auth/,
  /^\/forms\/edit\/[^/]+$/,
  /^\/forms\/preview\/[^/]+$/,
] as const;

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useAuth();

  if (noNavPaths.some((pattern) => pattern.test(pathname))) {
    return null;
  }
  
  return (
    <div className="fixed z-50 top-0 left-0 w-screen p-1.5 pr-3 bg-bg-500/25 border-b border-bg-500 backdrop-blur-md grid grid-cols-3">
      <div>
        <SidebarTrigger />
      </div>
      <Button
        variant="ghost"
        className="text-xl py-1.5 px-4 w-fit mx-auto"
      >
        SparkSight
      </Button>
      <div className="h-11 flex flex-row gap-2 justify-end">
        <ThemeSelector />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <Button
                className="size-11 rounded-full"
                variant="ghost"
                size="icon"
                onClick={() => router.push("profile")}
              >
                <span className="sr-only">View Profile</span>
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
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={-5}
          >
            <span>Profile</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
