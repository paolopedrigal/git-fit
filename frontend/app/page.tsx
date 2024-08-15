"use client";
import { signOut, useSession } from "next-auth/react";
import ReactTerminalClient from "@/components/react-terminal-client";
import {
  isQuotedString,
  splitIgnoringQuotes,
  getCurrentCalendarWeek,
  getCurrentCalendarMonth,
  isValidYYYYMM,
  getMonthStartEndDates,
  getDurationMinutes,
  getCurrentDate,
  getCurrentTime,
  removeAllQuotes,
  isValidYYYYMMDD,
} from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import help from "./(commands)/help";
import witLog from "./(commands)/wit-log";
import witLogOneline from "./(commands)/wit-log-oneline";
import witLogWeek from "./(commands)/wit-log-week";
import welcome from "./(commands)/welcome";
import { CommandMap } from "@/types/CommandMap";
import witLogMonth from "./(commands)/wit-log-month";
import witHelp from "./(commands)/wit-help";
import witError from "./(commands)/wit-error";
import witStatus from "./(commands)/wit-status";
import { Log, LogBase } from "@/types/Log";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [welcomeMessage, setWelcomeMessage] = useState(welcome);
  const [isWelcomeMessageReady, setIsWelcomMessageReady] =
    useState<boolean>(false);
  const [startWorkoutTime, setStartWorkoutTime] = useState<number>();
  const welcomeMessageRef = useRef(welcomeMessage);
  const { startWeekDate, endWeekDate } = useMemo(
    () => getCurrentCalendarWeek(),
    []
  );
  const { startMonthDate, endMonthDate } = useMemo(
    () => getCurrentCalendarMonth(),
    []
  );

  // API route: /api/logs/ handles error handling
  const logsCallback = useCallback(
    async (accessToken: string) => {
      const response = await fetch("/api/logs/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the token here
        },
      });
      const results: { data: Log[] } = await response.json();
      return results.data;
    },
    [session]
  );

  // API route: /api/logs/range/ handles error handling
  const logsCallbackRange = useCallback(
    async (accessToken: string, startDate: string, endDate: string) => {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      const response = await fetch(
        "/api/logs/range/" + `?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token here
          },
        }
      );

      const results: { data: Log[] } = await response.json();
      return results.data;
    },
    [session]
  );

  // API route: /api/log/ handles error handling
  const postLogCallback = useCallback(
    async (accessToken: string, description: string, duration: number) => {
      const logData: LogBase = {
        description: description,
        log_date: getCurrentDate(),
        log_time: getCurrentTime(),
        duration_minutes: duration,
      };
      const response = await fetch("/api/log/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(logData),
      });
      const results: { data: Log[] } = await response.json();
      return results.data;
    },
    [session]
  );

  // API route: /api/log/ handles error handling
  const deleteLogsCallback = useCallback(
    async (accessToken: string, date: string) => {
      const params = new URLSearchParams({
        date: date,
      });

      const response = await fetch(
        "/api/logs/delete/" + `?${params.toString()}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token here
          },
        }
      );

      const results: { data: Log[] } = await response.json();
      return results.data;
    },
    [session]
  );

  useEffect(() => {
    const getCurrentWeekLogs = async () => {
      if (session) {
        const logs = await logsCallbackRange(
          session.user.access_token,
          startWeekDate,
          endWeekDate
        );
        return logs;
      }
      return [];
    };

    if (session && status == "authenticated") {
      getCurrentWeekLogs().then((logs) => {
        setWelcomeMessage(
          <div>
            {welcome}
            {witLogWeek(logs, startWeekDate, endWeekDate)}
            <br />
            <br />
            <span>
              Type <strong>help</strong> to see available commands.
            </span>
            <br />
            <br />
          </div>
        );
        setIsWelcomMessageReady(true);
      });
    }
  }, [session, status]);

  useEffect(() => {
    welcomeMessageRef.current = welcomeMessage;
  }, [welcomeMessage]);

  console.log("status:", status);

  if (status == "authenticated" && isWelcomeMessageReady) {
    const commands: CommandMap = {
      help: help,

      wit: async (args) => {
        const a = splitIgnoringQuotes(args);
        /* wit add */
        if (a.length == 1 && a[0] == "add") {
          if (startWorkoutTime != undefined)
            return <span>Workout already in progress</span>;
          setStartWorkoutTime(new Date().getTime());
          return <span>Workout started</span>;
        } else if (
          /* wit commit -m <message> */
          a[0] == "commit" &&
          a.length == 3 &&
          a[1] == "-m" &&
          isQuotedString(a[2])
        ) {
          if (startWorkoutTime == undefined)
            return <span>Start workout first</span>;
          const endWorkoutTime = new Date().getTime();
          const postedLog = await postLogCallback(
            session.user.access_token,
            removeAllQuotes(a[2]),
            getDurationMinutes(startWorkoutTime, endWorkoutTime)
          );
          if (postedLog) {
            setStartWorkoutTime(undefined);
            return <span>Recording workout</span>;
          } else {
            return <span>Unable to record workout</span>;
          }
        } else if (
          /* wit status */
          a.length == 1 &&
          a[0] == "status"
        ) {
          return witStatus(startWorkoutTime);
        } else if (
          /* wit reset */
          a.length == 1 &&
          a[0] == "reset"
        ) {
          if (startWorkoutTime == undefined)
            return <span>No workout to forget</span>;
          setStartWorkoutTime(undefined);
          return <span>Forgetting workout</span>;
        } else if (
          /* wit reset --delete <YYYY-MM-DD> */
          a.length == 3 &&
          a[0] == "reset" &&
          a[1] == "--delete" &&
          isValidYYYYMMDD(a[2])
        ) {
          const logs = await deleteLogsCallback(
            session.user.access_token,
            a[2]
          );
          if (logs.length == 0) return <span>No workout logs to delete</span>;
          return <span>Deleting workout log(s)</span>;
        } else if (a.length == 1 && a[0] == "log") {
          /* wit log */
          const logs = await logsCallback(session.user.access_token);
          return witLog(logs, session.user.username);
        } else if (
          /* wit log --oneline | --week | --month */
          a.length == 2 &&
          a[0] == "log" &&
          (a[1] == "--oneline" || a[1] == "--week" || a[1] == "--month")
        ) {
          if (a[1] == "--oneline") {
            const logs = await logsCallback(session.user.access_token);
            return witLogOneline(logs);
          } else if (a[1] == "--week") {
            const logs = await logsCallbackRange(
              session.user.access_token,
              startWeekDate,
              endWeekDate
            );
            return witLogWeek(logs, startWeekDate, endWeekDate);
          } else {
            const logs = await logsCallbackRange(
              session.user.access_token,
              startMonthDate,
              endMonthDate
            );
            return witLogMonth(logs, startMonthDate, endMonthDate);
          }
        } else if (
          /* wit log --year-month YYYY-MM */
          a.length == 3 &&
          a[0] == "log" &&
          a[1] == "--year-month" &&
          isValidYYYYMM(a[2])
        ) {
          const { startDate, endDate } = getMonthStartEndDates(a[2]);
          const logs = await logsCallbackRange(
            session.user.access_token,
            startDate,
            endDate
          );
          return witLog(logs);
        } else if (
          /* wit log (--oneline | --month) --year-month YYYY-MM */
          a.length == 4 &&
          a[0] == "log" &&
          (a[1] == "--oneline" || a[1] == "--month") &&
          a[2] == "--year-month" &&
          isValidYYYYMM(a[3])
        ) {
          const { startDate, endDate } = getMonthStartEndDates(a[3]);
          const logs = await logsCallbackRange(
            session.user.access_token,
            startDate,
            endDate
          );
          if (a[1] == "--oneline") {
            return witLogOneline(logs);
          } else {
            return witLogMonth(logs, startDate, endDate);
          }
        } else if (
          /* wit log --year-month YYYY-MM (--oneline | --month) */
          a.length == 4 &&
          a[0] == "log" &&
          a[1] == "--year-month" &&
          isValidYYYYMM(a[2]) &&
          (a[3] == "--oneline" || a[3] == "--month")
        ) {
          const { startDate, endDate } = getMonthStartEndDates(a[2]);
          const logs = await logsCallbackRange(
            session.user.access_token,
            startDate,
            endDate
          );
          if (a[3] == "--oneline") {
            return witLogOneline(logs);
          } else {
            return witLogMonth(logs, startDate, endDate);
          }
        } else if (a.length == 0 || (a.length == 1 && a[0] == "--help")) {
          return witHelp;
        } else {
          return witError;
        }
      },

      signout: () => {
        console.log("Signing out...");
        signOut();
        return <span>Signing out...</span>;
      },
    };

    const prompt = <span>{session.user?.username}$</span>;

    return (
      <main>
        <ReactTerminalClient
          prompt={prompt}
          commands={commands}
          welcomeMessage={welcomeMessageRef.current}
          theme={"material-ocean"}
        />
      </main>
    );
  } else if (status == "unauthenticated") {
    redirect("/credentials/sign-in/");
  } else {
    return <span>Loading</span>;
  }
}
