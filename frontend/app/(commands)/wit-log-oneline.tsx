import { Log } from "@/types/Log";

const witLogOneline = (logs: Log[]) => {
  if (logs == undefined) return <span>Unable to get logs</span>;
  else if (logs.length == 0) return <span>No logs found</span>;

  return (
    <>
      {logs.map((log: Log, index) => (
        <span key={log.id}>
          <span style={{ color: "mediumpurple" }}>
            {log.id.slice(log.id.length - 7, log.id.length)}
          </span>
          <span style={{ marginLeft: "20px", color: "beige" }}>
            {log.description}
          </span>
          {index == logs.length - 1 ? <></> : <br />}
        </span>
      ))}
    </>
  );
};

export default witLogOneline;
