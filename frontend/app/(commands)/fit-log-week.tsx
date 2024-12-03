import { groupLogsByDate, removeYear } from "@/lib/utils";
import { Log } from "@/types/Log";

type Box = "⬜" | "⬛" | "🟩";

enum DayOfWeek {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

// prettier-ignore
const fitLogWeek = (logs: Log[], startDate: string, endDate: string) => {
  if (logs == undefined) return <></>;

  groupLogsByDate(logs)
  const today = (new Date()).getDay(); // 0 (Sunday) to 6 (Saturday)
  const daysOfWeek: Box[] = new Array(7).fill(0).map((_, index) => index >= today ? "⬜" : "⬛");
  for (let i = 0; i < logs.length; i++) {
    const dayOfWeek = (new Date(logs[i].log_date)).getUTCDay()
    daysOfWeek[dayOfWeek] = "🟩";
  }
  return (
    <span>
        <span><span style={{textDecoration: "underline"}}>This week:</span> {removeYear(startDate)} - {removeYear(endDate)}</span>
          {daysOfWeek.map((day, index) => {
            return <pre key={index} style={{color: index == today ? "gold" : "white"}}>{(DayOfWeek[index]).padEnd(13, " ")}{day}<br/></pre>
           })}
        <br/>
        <span>🟩 = worked out, ⬛ = skipped</span>
    </span>
  );
};

export default fitLogWeek;
