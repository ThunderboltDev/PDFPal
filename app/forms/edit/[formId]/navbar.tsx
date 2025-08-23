"use client";

import { FaUser } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/app/providers";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeSelector from "@/components/app/theme-selector";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, LayoutDashboard } from "lucide-react";

interface EditorNavbarProps {
  formId: string;
}

export default function EditorNavbar({ formId }: EditorNavbarProps) {
  const router = useRouter();
  const { userData } = useAuth();

  return (
    <div className="fixed z-100 top-0 left-0 w-screen p-1.5 pr-3 bg-bg-500/25 border-b border-bg-500 backdrop-blur-md grid grid-cols-3">
      <div>
        <SidebarTrigger />
      </div>
      <div></div>
      <div className="h-11 flex flex-row gap-2 justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <Button
                size="icon"
                variant="ghost"
                className="mt-1 text-fg-300 hover:text-blue-600"
                onClick={() => router.push(`/forms/preview/${formId}`)}
              >
                <Eye className="size-4.5" />
                <span className="sr-only">Preview Form</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>Preview Form</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">
              <Button
                onClick={() => router.push("/dashboard")}
                className="mt-1 text-fg-300 hover:text-accent"
                variant="ghost"
                size="icon"
              >
                <LayoutDashboard />
                <span className="sr-only">Go to Dashboard</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={-5}
          >
            <span>Dashboard</span>
          </TooltipContent>
        </Tooltip>
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
