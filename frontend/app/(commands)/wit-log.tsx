import { Log } from "@/types/Log";
import { formatGitDate, formatGitTime } from "@/lib/utils";

// prettier-ignore
const witLog = (logs: Log[], username: string = "") => {
  return (
    <span>
      {logs.map((log) => (
        <div key={log.id}>
          <span style={{ color: "mediumpurple" }}>commit {log.id}</span>
          <br/>
          <span>Author: {username}</span>
          <br/>
          <pre>Date:    {formatGitDate(log.log_date)} {formatGitTime(log.log_time)}</pre>
          <br/>
          <span style={{ marginLeft: "20px", color: "beige" }}>{log.description}</span>
          <br/>
          <br/>
        </div>
      ))}
      <span>:</span>
    </span>
  );
};

export default witLog;
