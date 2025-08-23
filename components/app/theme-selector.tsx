"use client";

import { LuMonitor, LuSun, LuMoon } from "react-icons/lu";

import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const themeIcons: Record<Theme, ReactNode> = {
  system: <LuMonitor className="size-4.5 text-fg-300" />,
  light: <LuSun className="size-4.5 text-fg-300" />,
  dark: <LuMoon className="size-4.5 text-fg-300" />,
};

type Theme = "system" | "light" | "dark";
const themes: Theme[] = ["system", "light", "dark"];

export default function ThemeSelector() {
  const { setTheme, theme: currentTheme } = useTheme() as {
    setTheme: (theme: Theme) => void;
    theme: Theme;
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Select
      value={currentTheme}
      onValueChange={(val) => setTheme(val as Theme)}
    >
      <SelectTrigger
        showArrow={false}
        className="border-none bg-transparent hover:bg-bg-500/25 shadow-none transition-colors duration-300 ease-in mt-1 pl-2.25 min-h-9 w-9"
      >
        {themeIcons[currentTheme]}
      </SelectTrigger>
      <SelectContent
        side="bottom"
        align="end"
      >
        {themes.map((theme) => (
          <SelectItem
            key={theme}
            value={theme}
          >
            {themeIcons[theme]} {theme[0].toUpperCase() + theme.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
