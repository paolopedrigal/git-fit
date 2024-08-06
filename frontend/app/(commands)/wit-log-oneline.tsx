import { Log } from "@/types/Log";

// prettier-ignore
const witLogOneline = (logs: Log[]) => {
  return (
    <span>
      {logs.map((log) => (
        <div key={log.id}>
          <span style={{ color: "mediumpurple" }}>{log.id.slice(log.id.length-7, log.id.length)}</span>
          <span style={{ marginLeft: "20px", color: "beige" }}>{log.description}</span>
          <br/>
        </div>
      ))}
      <span>:</span>
    </span>
  );
};

export default witLogOneline;
