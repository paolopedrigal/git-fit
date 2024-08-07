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
          <span style={{ color: "mediumpurple" }}>commit {log.id}</span>
          <br/>
          <span>Author: {username}</span>
          <br/>
          <pre>Date:    {formatGitDate(log.log_date)} {formatGitTime(log.log_time)}</pre>
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
