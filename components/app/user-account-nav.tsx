import { getUserSubscriptionPlan } from "@/lib/creem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DollarSign, Gem, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface UserAccountNavProps {
  email: string | null;
  avatarUrl: string | null;
  name: string;
}

export default async function UserAccountNav({
  email,
  avatarUrl,
  name,
}: UserAccountNavProps) {
  const { isSubscribed } = await getUserSubscriptionPlan();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="overflow-visible"
        asChild
      >
        <Button className="rounded-full size-8 aspect-square bg-gray-300">
          <Avatar className="size-8 relative">
            <AvatarImage src={avatarUrl ?? undefined} />
            <AvatarFallback>
              <span className="sr-only">{name}</span>
              <User className="size-4 text-zinc-800" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white"
        align="end"
      >
        <div className="flex items-center justify-center gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-foreground">{name}</p>
            {email && (
              <p className="w-[200px] truncate text-xs text-zinc-700">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="size-4 text-foreground" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {isSubscribed ? (
            <Link href="/dashboard/billing">
              <DollarSign className="size-4 text-primary" />
              Manage Subscriptions
            </Link>
          ) : (
            <Link
              href="/pricing"
              className="text-primary !hover:text-primary"
            >
              <Gem className="size-4 text-primary" />
              Upgrade
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <LogoutLink className="text-destructive !hover:text-destructive">
            <LogOut className="size-4 text-destructive" />
            Log out
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
