"use client";

import { ComponentProps, KeyboardEvent, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

const invalidCharacters = ["e", "E", "+", "-"];

const parseValue = (value: string): string[] => {
  const parts = value.match(/^(0?[1-9]|1[0-2]):([0-5][0-9]) ?([AaPp][Mm])$/);
  if (parts) {
    const [, hourStr, minuteStr, period] = parts;
    const hour = String(parseInt(hourStr, 10)).padStart(2, "0");
    const minute = minuteStr;
    const upperPeriod = period.toUpperCase();
    return [hour, minute, upperPeriod];
  }

  return ["", "", "AM"];
};

const blockInvalidCharacters = (e: KeyboardEvent<HTMLInputElement>) => {
  if (invalidCharacters.includes(e.key)) {
    e.preventDefault();
  }
};

const sanitizeInput = (value: string, min: number, max: number) => {
  let num = parseInt(value, 10);
  if (isNaN(num)) return "";
  if (num < min) num = min;
  if (num > max) num = max;
  return String(num).padStart(2, "0");
};

interface TimeProps {
  id?: string;
  value?: string;
  required?: boolean;
  is24HourFormat?: boolean;
  onValueChange: (value: string) => void;
  onBlur?: (value: string, source: "h" | "m" | "period") => void;
  timeInvalid?: boolean;
  periodInvalid?: boolean;
}

export default function Time({
  id,
  value,
  required = false,
  is24HourFormat = false,
  onValueChange,
  onBlur = () => {},
  timeInvalid,
  periodInvalid,
  ...props
}: Omit<ComponentProps<typeof Input>, "onBlur"> & TimeProps) {
  const parsedValue = parseValue(value ?? "");

  const [hour, setHour] = useState(parsedValue[0]);
  const [minute, setMinute] = useState(parsedValue[1]);
  const [period, setPeriod] = useState(parsedValue[2]);

  const descriptionId = `time-group-description-${id}`;

  return (
    <fieldset
      aria-required={required}
      className="flex flex-row gap-1"
    >
      <legend className="sr-only">Select Time:</legend>
      <div
        className={cn(
          timeInvalid ? "ring-destructive/50 border-destructive/75" : "",
          "input w-fit py-0 px-1.5 flex flex-row items-center cursor-text",
          "focus-within:ring-3 focus-within:ring-accent/50 focus-within:border-accent/75"
        )}
      >
        <Label
          htmlFor={id}
          className="sr-only"
        >
          Hour
        </Label>
        <Input
          type="number"
          id={id}
          name="hour"
          className="max-h-min max-w-7 placeholder:translate-x-[3px] p-0 grid place-items-center shadow-none border-0 focus-visible:ring-0"
          value={hour}
          min={0}
          max={is24HourFormat ? 23 : 11}
          maxLength={2}
          placeholder="HH"
          aria-describedby={descriptionId}
          required={required}
          {...props}
          onKeyDown={blockInvalidCharacters}
          aria-invalid={timeInvalid}
          onBlur={(e) => {
            const sanitizedInput = sanitizeInput(
              e.target.value,
              0,
              is24HourFormat ? 23 : 11
            );

            onBlur(sanitizedInput, "h");
            setHour(sanitizedInput);
            onValueChange(`${sanitizedInput}:${minute} ${period}`);
          }}
          onChange={(e) => {
            if (e.target.value.length <= 2) {
              setHour(e.target.value);
              onValueChange(`${e.target.value}:${minute} ${period}`);
            }
          }}
        />
        <Label
          htmlFor={`minute-${id}`}
          className="sr-only"
        >
          Minute
        </Label>
        <div className="h-min px-0 grid align-baseline items-center">:</div>
        <Input
          type="number"
          id={`minute-${id}`}
          name="minute"
          className="max-h-min max-w-7 placeholder:translate-x-[1px] p-0 grid place-items-center shadow-none border-none focus-visible:ring-0"
          value={minute}
          min={0}
          max={59}
          maxLength={2}
          aria-describedby={descriptionId}
          placeholder="MM"
          required={required}
          {...props}
          onKeyDown={blockInvalidCharacters}
          aria-invalid={timeInvalid}
          onBlur={(e) => {
            const sanitizedInput = sanitizeInput(e.target.value, 0, 59);
            onBlur(sanitizedInput, "m");
            setMinute(sanitizedInput);
            onValueChange(`${hour}:${sanitizedInput} ${period}`);
          }}
          onChange={(e) => {
            if (e.target.value.length <= 2) {
              setMinute(e.target.value);
              onValueChange(`${hour}:${e.target.value} ${period}`);
            }
          }}
        />
      </div>
      {!is24HourFormat && (
        <>
          <Label
            htmlFor={`period-${id}`}
            className="sr-only"
          >
            Select AM/PM
          </Label>
          <Select
            onValueChange={(value) => {
              setPeriod(value);
              onValueChange(`${hour}:${minute} ${value}`);
            }}
          >
            <SelectTrigger
              id={`period-${id}`}
              aria-describedby={descriptionId}
              className="bg-transparent hover:bg-transparent"
              aria-invalid={periodInvalid}
            >
              <span>{period}</span>
            </SelectTrigger>
            <SelectContent onBlur={() => onBlur(period, "period")}>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
      <span
        id={descriptionId}
        className="sr-only"
      >
        Enter hour, minute {!is24HourFormat && "and select AM or PM"}
      </span>
    </fieldset>
  );
}
