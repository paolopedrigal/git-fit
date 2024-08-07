import { formatMonthYear, groupLogsByDate, removeYear } from "@/lib/utils";
import { Log } from "@/types/Log";

type Box = "⬜" | "⬛" | "🟩";

enum DayOfWeek {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

const witLogMonth = (
  logs: Log[],
  startMonthDate: string,
  endMonthDate: string
) => {
  groupLogsByDate(logs);

  const today = new Date();
  const startOfMonth = new Date(startMonthDate);
  const endOfMonth = new Date(endMonthDate);
  const daysInMonth = endOfMonth.getUTCDate();

  const daysOfMonth: Box[] = new Array(daysInMonth)
    .fill("⬛")
    .map((_, index) =>
      today >= startOfMonth && today <= endOfMonth
        ? index >= today.getDate() - 1
          ? "⬜"
          : "⬛"
        : today < startOfMonth
        ? "⬜"
        : "⬛"
    );

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i].log_date);
    const day = logDate.getUTCDate() - 1;
    daysOfMonth[day] = "🟩";
  }

  const calendar = [];
  const startDayOfWeek = startOfMonth.getUTCDay();

  for (let i = 0; i < startDayOfWeek; i++) {
    calendar.push(" ");
  }

  for (let i = 0; i < daysInMonth; i++) {
    calendar.push(daysOfMonth[i]);
  }

  const weeks = [];
  while (calendar.length) {
    weeks.push(calendar.splice(0, 7));
  }

  return (
    <span>
      <span
        style={{
          width: "100%",
          textDecoration: "underline",
          textAlign: "center",
          marginLeft: "100px",
        }}
      >
        {formatMonthYear(startMonthDate)}
      </span>
      <pre>
        {/* Day of the Week Labels */}
        <div>
          {Object.values(DayOfWeek).map((day, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                width: "42px",
                textAlign: "center",
              }}
            >
              {DayOfWeek[index]}
            </span>
          ))}
        </div>
        {/* Calendar Weeks */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex}>
            {week.map((day, dayIndex) => (
              <span
                key={dayIndex}
                style={{
                  display: "inline-block",
                  width: "42px",
                  textAlign: "center",
                  //   color:
                  //     new Date().getDate() ===
                  //     weekIndex * 7 + dayIndex - startDayOfWeek + 1
                  //       ? "gold"
                  //       : "white",
                }}
              >
                {day}{" "}
              </span>
            ))}
          </div>
        ))}
      </pre>
      <br />
      <span>🟩 = worked out, ⬛ = skipped</span>
    </span>
  );
};

export default witLogMonth;
