"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import ReactTerminalClient from "@/components/react-terminal-client";
import { SignInUp } from "@/components/sign-in-up";
import {
  isQuotedString,
  splitIgnoringQuotes,
  getCurrentCalendarWeek,
  getCurrentCalendarMonth,
  logDateDetails,
} from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import help from "./(commands)/help";
import witLog from "./(commands)/wit-log";
import witLogOneline from "./(commands)/wit-log-oneline";
import witLogWeek from "./(commands)/wit-log-week";
import welcome from "./(commands)/welcome";
import { renderToString } from "react-dom/server";
import { CommandMap } from "@/types/CommandMap";
import witLogMonth from "./(commands)/wit-log-month";

export default function Home() {
  const { data: session, status } = useSession();
  const [welcomeMessage, setWelcomeMessage] = useState(welcome);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const welcomeMessageRef = useRef(welcomeMessage);
  const BACKEND_URL = useMemo(
    () => process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    []
  );
  const { startWeek, endWeek } = useMemo(() => getCurrentCalendarWeek(), []);
  const { startMonth, endMonth } = useMemo(() => getCurrentCalendarMonth(), []);

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
          startWeek,
          endWeek
        );
        return logs;
      }
    };

    if (session && status == "authenticated") {
      getCurrentWeekLogs().then((logs) => {
        setWelcomeMessage(
          <div>
            {welcome}
            {witLogWeek(logs, startWeek, endWeek)}
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

      // prettier-ignore
      wit: 
      async (args) => {
        const a = splitIgnoringQuotes(args);
        if (
          (a.length == 1 &&
          a[0] == "add") || (a.length == 2 && a[0] == "add" && a[1] == "-A")
        ) {
            return <span>Adding today's workout</span>;
        } else if (
          a[0] == "commit" &&
          a.length == 3 &&
          a[1] == "-m" &&
          isQuotedString(a[2])
        ) {
          return <span>Committing today's workout</span>;
        } else if (a.length == 1 && a[0] == "log") {
          const logs = await logsCallback(session.user.access_token);
          return witLog(logs, session.user.username);
        } else if (a.length == 2 && a[0] == "log" && (a[1] == "--oneline" || a[1] == "--week" || a[1] == "--month")) {
          if (a[1] == "--oneline") {
            const logs = await logsCallback(session.user.access_token);
            return witLogOneline(logs);
          } else if (a[1] == "--week") {
            const logs = await logsCallbackRange(session.user.access_token, startWeek, endWeek)
            return witLogWeek(logs, startWeek, endWeek)
          } else {
            const logs = await logsCallbackRange(session.user.access_token, startMonth, endMonth)
            return witLogMonth(logs, startMonth, endMonth);
          }
          
        } else if (a.length == 0 || (a.length == 1 && a[0] == "--help")) {
          return (
            <span>
              <pre>
                usage: wit {"[<"}command{">]"} {"[<"}options{">]"}
                <br />
              </pre>
              <br />
              <span>
                Commands:
                <br />
                <pre style={{ marginLeft: "20px" }}>
                  add .                   Track current day's workout
                </pre>
                <pre style={{ marginLeft: "20px" }}>
                  commit -m {"<"}message{">"}     Record workouts to repository
                </pre>
              </span>
              <br />
              <span>
                Options:
                <br />
                <pre style={{ marginLeft: "20px" }}>
                  --help Show this help message and exit
                </pre>
              </span>
              <br />
              <span>
                Examples:
                <br />
                <pre style={{ marginLeft: "20px" }}>
                  wit commit -m "push: 55lbs DB bench press"
                </pre>
                <pre style={{ marginLeft: "20px" }}>
                  wit commit -m "legs: 135lbs squat"
                </pre>
              </span>
            </span>
          );
        } else {
          return (
            <span>
              <span>
                Invalid command or options. Use the following usage guidelines:
                <br />
              </span>
              <br/>
              <span style={{ marginLeft: "20px" }}>
                wit add {"["}-A{"]"}<br />
              </span>
              <span style={{ marginLeft: "20px" }}>
                wit commit -m {"<"}message{">"}
                <br />
              </span>
              <span style={{ marginLeft: "20px" }}>
                wit log {"["}--oneline | --week | --month | --month-year {"<"}month year{">]"}
                <br />
              </span>
              <br />
              <span>
                Enter "wit --help" for more information.
              </span>
            </span>
          );
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
