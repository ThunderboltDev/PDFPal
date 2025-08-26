import { Calendar } from "lucide-react";

import {
  DayPicker,
  DayPickerProps,
  getDefaultClassNames,
} from "react-day-picker";
import { ComponentProps, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button, buttonVariants } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

const defaultClassNames = getDefaultClassNames();

export interface DateProps {
  id: string;
  value?: string;
  onChange: (date: Date) => void;
  onBlur: (date: string) => void;
  placeholder?: string;
  captionLayout?: string;
  buttonVariant?: ComponentProps<typeof Button>["variant"];
  disabled?: DayPickerProps["disabled"];
  ariaInvalid?: boolean;
}

export function Date({
  id,
  value = "",
  onChange,
  onBlur,
  placeholder = "Date",
  captionLayout = "label",
  buttonVariant = "ghost",
  disabled,
  ariaInvalid = false,
}: DayPickerProps & DateProps) {
  const [date, setDate] = useState(value);
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Input
          id={id}
          className="min-w-full"
          type="text"
          value={date}
          placeholder={placeholder}
          icon={<Calendar />}
          iconTooltip="Date Picker"
          // onBlur={onBlur}
          readOnly
          aria-invalid={ariaInvalid}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onBlur={() => onBlur(date)}
      >
        <DayPicker
          mode="single"
          onDayClick={(date: Date) => {
            setOpen(false);
            onChange(date);
            setDate(date.toDateString());
          }}
          selected={date ? new globalThis.Date(date) : undefined}
          captionLayout={captionLayout}
          disabled={disabled}
          // onDayBlur={onBlur}
          classNames={{
            root: cn("w-fit", defaultClassNames.root),
            months: cn(
              "flex gap-4 flex-col md:flex-row relative",
              defaultClassNames.months
            ),
            month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
            nav: cn(
              "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
              defaultClassNames.nav
            ),
            button_previous: cn(
              buttonVariants({ variant: buttonVariant }),
              "size-(--cell-size) fill-fg-100 aria-disabled:opacity-50 p-1.5 select-none ml-0"
            ),
            button_next: cn(
              buttonVariants({ variant: buttonVariant }),
              "size-(--cell-size) fill-fg-100 aria-disabled:opacity-50 p-1.5 select-none mr-0"
            ),
            month_caption: cn(
              "flex align-center justify-center h-full w-full px-(--cell-size)"
            ),
            dropdowns: cn(
              "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
              defaultClassNames.dropdowns
            ),
            dropdown_root: cn(
              "relative has-focus:border-ring border border-bg-300 shadow-xs has-focus:ring-accent/50 has-focus:ring-[3px] rounded-md",
              defaultClassNames.dropdown_root
            ),
            dropdown: cn(
              "absolute bg-bg-100 inset-0 opacity-0",
              defaultClassNames.dropdown
            ),
            caption_label: cn(
              "select-none font-light",
              captionLayout === "label"
                ? "text-sm"
                : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-fg-500 [&>svg]:size-3.5",
              defaultClassNames.caption_label
            ),
            table: "w-full border-collapse",
            weekdays: cn("flex"),
            weekday: cn(
              "text-fg-300 rounded-md flex-1 font-normal text-[0.8rem] select-none"
            ),
            week: cn("flex w-full mt-2"),
            week_number_header: cn("select-none w-(--cell-size)"),
            week_number: cn(
              "text-[0.8rem] font-normal select-none text-fg-300"
            ),
            day: cn(
              "relative font-light w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square !rounded-sm"
            ),
            day_button: cn(
              buttonVariants({ variant: buttonVariant }),
              "aspect-square !rounded-sm size-8 font-light text-center focus-visible:ring-3 focus-visible:ring-accent/50",
              "bg-transparent hover:bg-bg-300"
            ),
            selected: cn("bg-accent/50 hover:bg-accent"),
            outside: cn("text-fg-300 opacity-50 rounded-sm"),
            disabled: cn("text-fg-300 opacity-50 cursor-not-allowed"),
            hidden: cn("invisible", defaultClassNames.hidden),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
