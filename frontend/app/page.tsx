"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import ReactTerminalClient from "@/components/react-terminal-client";
import { SignInUp } from "@/components/sign-in-up";
import {
  isQuotedString,
  splitIgnoringQuotes,
  getCurrentCalendarWeek,
  getCurrentCalendarMonth,
  isValidYYYYMM,
  getMonthStartEndDates,
  getDurationMinutes,
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

export default function Home() {
  const { data: session, status } = useSession();
  const [welcomeMessage, setWelcomeMessage] = useState(welcome);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startWorkoutTime, setStartWorkoutTime] = useState<number>();
  const welcomeMessageRef = useRef(welcomeMessage);
  const BACKEND_URL = useMemo(
    () => process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    []
  );
  const { startWeekDate, endWeekDate } = useMemo(
    () => getCurrentCalendarWeek(),
    []
  );
  const { startMonthDate, endMonthDate } = useMemo(
    () => getCurrentCalendarMonth(),
    []
  );

  const logsCallback = useCallback(
    async (accessToken: string) => {
      const response = await fetch(BACKEND_URL + "/logs/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Include the token here
        },
      });

      if (response.ok) {
        const results = await response.json();
        return results;
      } else {
        console.error(
          "Could not GET response at location:",
          BACKEND_URL + "/logs/"
        );
      }
    },
    [session]
  );

  const logsCallbackRange = useCallback(
    async (accessToken: string, startDate: string, endDate: string) => {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      const response = await fetch(
        BACKEND_URL + "/logs/range/" + `?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token here
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        return results;
      } else {
        console.error(
          "Could not GET response at location:",
          BACKEND_URL + "/logs/range/"
        );
      }
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
        setIsLoading(false);
      });
    }
  }, [session, status]);

  useEffect(() => {
    welcomeMessageRef.current = welcomeMessage;
  }, [welcomeMessage]);

  console.log("status:", status);

  if (status == "authenticated" && !isLoading) {
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
          console.log(
            "duration:",
            getDurationMinutes(startWorkoutTime, endWorkoutTime)
          );
          setStartWorkoutTime(undefined);
          return <span>Recording workout</span>;
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
          /* wit reset --delete <commit> */
          a.length == 3 &&
          a[0] == "reset" &&
          a[1] == "--delete"
        ) {
          return <span>Deleting workout</span>;
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
  } else
    return (
      <main>
        <p>No session currently</p>
        <a onClick={() => signIn()}>Sign in</a>
        <SignInUp />
      </main>
    );
}
