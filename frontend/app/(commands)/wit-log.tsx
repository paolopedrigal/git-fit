import { Log } from "@/types/Log";
import { formatGitDate, formatGitTime } from "@/lib/utils";

// prettier-ignore
const witLog = (logs: Log[], username: string = "") => {
  if (logs.length == 0) {
    return <span>No logs found</span>;
  }

  return (
      <>      
      {logs.map((log: Log, index) => (
        <div key={log.id}>
          <pre style={{ color: "mediumpurple" }}>commit {log.id}</pre>
          <pre>{"Author:".padEnd(10, " ")}{username}</pre>
          <pre>{"Date:".padEnd(10, " ")}{formatGitDate(log.log_date)} {formatGitTime(log.log_time)}</pre>
          <pre>{"Duration:".padEnd(10, " ")}{log.duration_minutes} minutes</pre>
          <br/>
          <span style={{ marginLeft: "20px", color: "beige" }}>{log.description}</span>
          {index == logs.length - 1 ? <></> : <br/>}
          <br/>
        </div>
      ))}
      </>
  );
};

export default witLog;
