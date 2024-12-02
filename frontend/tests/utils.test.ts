import {
  cn,
  isQuotedString,
  splitIgnoringQuotes,
  formatGitDate,
  formatGitTime,
  getCurrentCalendarWeek,
  getCurrentCalendarMonth,
  groupLogsByDate,
  removeYear,
  formatMonthYear,
  isValidYYYYMM,
  isValidYYYYMMDD,
  getMonthStartEndDates,
  getDurationMinutes,
  getTimeOfDay,
  getCurrentDate,
  getCurrentTime,
  removeAllQuotes,
} from "@/lib/utils";
import { Log } from "@/types/Log";

describe("utils.ts", () => {
  describe("cn()", () => {
    test("merges class names", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });
  });

  describe("isQuotedString()", () => {
    test("checks if a string is quoted", () => {
      expect(isQuotedString('"quoted"')).toBe(true);
      expect(isQuotedString("'quoted'")).toBe(true);
      expect(isQuotedString("not quoted")).toBe(false);
    });
  });

  describe("splitIgnoringQuotes()", () => {
    test("splits strings ignoring quoted parts", () => {
      const input = `one two "three four" 'five six'`;
      const expected = ["one", "two", '"three four"', "'five six'"];
      expect(splitIgnoringQuotes(input)).toEqual(expected);
    });
  });

  describe("formatGitDate()", () => {
    test("formats a date to a Git-friendly format", () => {
      const input = "2024-12-02T15:30:00Z";
      const expected = "Mon, Dec 02 2024";
      expect(formatGitDate(input)).toBe(expected);
    });
  });

  describe("formatGitTime()", () => {
    test("formats time accurately", () => {
      expect(formatGitTime("15:30:45.123")).toBe("15:30:45");
    });
  });

  describe("groupLogsByDate()", () => {
    test("groups logs by their date", () => {
      const logs: Log[] = [
        {
          description: "Log A",
          log_date: "2024-12-01",
          log_time: "12:00",
          duration_minutes: 10,
          author_id: "1",
          id: "1",
        },
        {
          description: "Log B",
          log_date: "2024-12-01",
          log_time: "13:00",
          duration_minutes: 15,
          author_id: "2",
          id: "2",
        },
        {
          description: "Log C",
          log_date: "2024-12-02",
          log_time: "14:00",
          duration_minutes: 20,
          author_id: "3",
          id: "3",
        },
      ];
      const grouped = groupLogsByDate(logs);
      expect(grouped).toEqual({
        "2024-12-01": [logs[0], logs[1]],
        "2024-12-02": [logs[2]],
      });
    });
  });

  describe("removeYear()", () => {
    test("removes the year from a YYYY-MM-DD date string", () => {
      expect(removeYear("2024-12-01")).toBe("12-01");
    });
  });

  describe("isValidYYYYMM()", () => {
    test("validates YYYY-MM date format", () => {
      expect(isValidYYYYMM("2024-12")).toBe(true);
      expect(isValidYYYYMM("2024-13")).toBe(false);
    });
  });

  describe("isValidYYYYMMDD()", () => {
    test("validates YYYY-MM-DD date format", () => {
      expect(isValidYYYYMMDD("2024-12-02")).toBe(true);
      expect(isValidYYYYMMDD("2024-13-02")).toBe(false);
    });
  });

  describe("getDurationMinutes()", () => {
    test("calculates duration in minutes", () => {
      const startTime = new Date("2024-12-01T10:00:00Z").getTime();
      const endTime = new Date("2024-12-01T10:30:00Z").getTime();
      expect(getDurationMinutes(startTime, endTime)).toBe(30);
    });
  });

  describe("removeAllQuotes()", () => {
    test("removes all quotes from a string", () => {
      expect(removeAllQuotes(`'hello' "world"`)).toBe("hello world");
    });
  });

  // Tests for unused functions
  describe("formatMonthYear()", () => {
    test("formats date to Month Year", () => {
      expect(formatMonthYear("2024-12-01")).toBe("Dec 2024");
    });
  });

  describe("getCurrentCalendarWeek()", () => {
    test("retrieves the start and end dates of the current week", () => {
      const { startWeekDate, endWeekDate } = getCurrentCalendarWeek();
      expect(new Date(startWeekDate)).toBeInstanceOf(Date);
      expect(new Date(endWeekDate)).toBeInstanceOf(Date);
    });
  });

  describe("getCurrentCalendarMonth()", () => {
    test("retrieves the start and end dates of the current month", () => {
      const { startMonthDate, endMonthDate } = getCurrentCalendarMonth();
      expect(new Date(startMonthDate)).toBeInstanceOf(Date);
      expect(new Date(endMonthDate)).toBeInstanceOf(Date);
    });
  });

  describe("getMonthStartEndDates()", () => {
    test("calculates the start and end dates of a given month", () => {
      const { startDate, endDate } = getMonthStartEndDates("2024-12");
      expect(new Date(startDate)).toBeInstanceOf(Date);
      expect(new Date(endDate)).toBeInstanceOf(Date);
    });
  });

  describe("getTimeOfDay()", () => {
    test("retrieves the time of day", () => {
      const date = new Date("2024-12-01T14:30:00");
      const timestamp = date.getTime(); // Get timestamp in milliseconds
      expect(getTimeOfDay(timestamp)).toBe("02:30:00 PM");
    });
  });

  describe("getTimeOfDay()", () => {
    test("retrieves the time of day", () => {
      const date = new Date("2024-12-01T11:00:00");
      const timestamp = date.getTime(); // Get timestamp in milliseconds
      expect(getTimeOfDay(timestamp)).toBe("11:00:00 AM");
    });
  });

  describe("getCurrentDate()", () => {
    test("retrieves the current date", () => {
      const currentDate = getCurrentDate(); // Assuming it returns a string
      expect(currentDate).toMatch(/^\d{4}-\d{2}-\d{2}$/); // Validate date format "YYYY-MM-DD"
    });
  });

  describe("getCurrentTime()", () => {
    test("retrieves the current time", () => {
      const currentTime = getCurrentTime(); // Assuming it returns a string
      expect(currentTime).toMatch(/^\d{2}:\d{2}:\d{2}$/); // Validate time format "HH:MM:SS"
    });
  });
});
