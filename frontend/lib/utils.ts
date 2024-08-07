import { Log } from "@/types/Log";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isQuotedString(input: string): boolean {
  const regex = /^["'].*["']$/;
  return regex.test(input);
}

export function splitIgnoringQuotes(input: string): string[] {
  // Regular expression to match words or quoted substrings including the quotes
  const regex = /[^\s"']+|"[^"]*"|'[^']*'/g;
  const result: string[] = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    result.push(match[0]);
  }

  return result;
}

export function formatGitDate(dateString: string): string {
  const date = new Date(dateString);

  // Get the UTC string
  const utcString = date.toUTCString(); // Example: "Mon, 05 Aug 2024 15:30:00 GMT"

  // Split the UTC string into parts
  const [dayOfWeek, day, month, year] = utcString.split(" ").slice(0, 4);

  // Format the date string
  const formattedDate = `${dayOfWeek} ${month} ${day} ${year}`;

  return formattedDate;
}

export function formatGitTime(timeString: string): string {
  // Parse the time string with milliseconds
  const [hours, minutes, secondsWithMs] = timeString.split(":");
  const [seconds, milliseconds] = secondsWithMs.split(".");

  // Convert to desired format
  const hoursFormatted = String(parseInt(hours)).padStart(2, "0");
  const minutesFormatted = String(parseInt(minutes)).padStart(2, "0");
  const secondsFormatted = String(parseInt(seconds)).padStart(2, "0");

  return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
}

// Don't use UTC time since getting current (local time) calendar week
export function getCurrentCalendarWeek(): {
  startWeekDate: string;
  endWeekDate: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Calculate the start of the week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);

  // Calculate the end of the week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startWeekDate: formatDate(startOfWeek),
    endWeekDate: formatDate(endOfWeek),
  };
}

// Don't use UTC time since getting current (local time) calendar month
export function getCurrentCalendarMonth(): {
  startMonthDate: string;
  endMonthDate: string;
} {
  const now = new Date();

  // Calculate the start of the month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Calculate the end of the month
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startMonthDate: formatDate(startOfMonth),
    endMonthDate: formatDate(endOfMonth),
  };
}

export function groupLogsByDate(logs: Log[]): { [date: string]: Log[] } {
  // Sort logs by log_date
  logs.sort(
    (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
  );

  // Group logs by date
  const groupedLogs: { [date: string]: Log[] } = {};

  logs.forEach((log) => {
    const date = log.log_date;
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });

  return groupedLogs;
}

export function removeYear(yyyyMMDD: string) {
  return yyyyMMDD.slice(5);
}

export function formatMonthYear(dateString: string) {
  // Define an array of month abbreviations
  const monthAbbreviations = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Parse the date string
  const date = new Date(dateString);

  // Get the month and year
  const month = monthAbbreviations[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Return the formatted string
  return `${month} ${year}`;
}

export function isValidYYYYMM(dateString: string): boolean {
  // Regular expression to match the YYYY-MM format
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(dateString);
}

export function getMonthStartEndDates(yyyyMmString: string): {
  startDate: string;
  endDate: string;
} {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(yyyyMmString)) {
    throw new Error("Invalid YYYY-MM format");
  }

  const [year, month] = yyyyMmString.split("-").map(Number);
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0));

  const formatDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

export function logDateDetails(dateString: string): void {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  console.log("Date Object:", date);
  console.log("ISO String:", date.toISOString());
  console.log("Locale String (en-US):", date.toLocaleDateString("en-US"));
  console.log("UTC Date String:", date.toUTCString());
}

export function getDurationMinutes(startTime: number, endTime: number): number {
  return (endTime - startTime) / 60000;
}

export function getTimeOfDay(milliseconds: number): string {
  const date = new Date(milliseconds);

  let hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const seconds: number = date.getSeconds();
  const ampm: string = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Pad minutes and seconds with leading zeros if necessary
  const padWithZero = (num: number): string => num.toString().padStart(2, "0");

  const timeOfDay: string = `${padWithZero(hours)}:${padWithZero(
    minutes
  )}:${padWithZero(seconds)} ${ampm}`;

  return timeOfDay;
}
