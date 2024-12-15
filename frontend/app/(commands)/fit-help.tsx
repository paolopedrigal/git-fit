const fitHelp = (
  <>
    <pre>
      usage: fit {"[<"}command{">]"} {"[<"}args{">]"}
    </pre>
    <br />
    <span>COMMANDS</span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"add".padEnd(12, " ")}</strong>Start a workout
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"commit".padEnd(12, " ")}</strong>Record workout
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"log".padEnd(12, " ")}</strong>Show workout entries
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"status".padEnd(12, " ")}</strong>Check if working out
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"reset".padEnd(12, " ")}</strong>Forget current workout {"("}or
      delete workout with <strong>--delete</strong> option{")"}
    </pre>
    <br />
    <span>OPTIONS</span>
    <br />
    <span>
      <strong>commit</strong> options:
    </span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"-m <message>".padEnd(26, " ")}</strong>
      {"(Required) "}End and commit the workout with a commit message
    </pre>
    <br />
    <span>
      <strong>reset</strong> options:
    </span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"--delete <YYYY-MM-DD>".padEnd(26, " ")}</strong>Delete a
      specific workout
    </pre>
    <br />
    <span>
      <strong>log</strong> options:
    </span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"--oneline".padEnd(26, " ")}</strong>Display logs in a single
      line
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"--week".padEnd(26, " ")}</strong>Graphs logs for the current
      week
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"--month".padEnd(26, " ")}</strong>Graphs logs for the month.
      Defaults to current month
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      <strong>{"--year-month <YYYY-MM>".padEnd(26, " ")}</strong>Display logs
      for a specific year and month
    </pre>
    <br />
    <span>
      <strong>Note:</strong>
    </span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      - The <strong>--week</strong> option can&apos;t be combined with the{" "}
      <strong>--month-year</strong> option.
    </pre>
    <br />
    <span>
      <strong>Examples:</strong>
    </span>
    <br />
    <span style={{ marginLeft: "20px" }}>fit add</span>
    <br />
    <span style={{ marginLeft: "20px" }}>fit status</span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      fit commit -m &quot;push: chest, triceps, shoulders&quot;
    </pre>
    <span style={{ marginLeft: "20px" }}>fit log --week</span>
    <br />
    <span style={{ marginLeft: "20px" }}>fit log --month</span>
    <br />
    <pre style={{ marginLeft: "20px" }}>fit log --year-month 2024-07</pre>
    <pre style={{ marginLeft: "20px" }}>
      fit log --oneline --year-month 2023-03
    </pre>
    <pre style={{ marginLeft: "20px" }}>fit reset --delete 2022-09-22</pre>
    <span style={{ marginLeft: "20px" }}>fit reset</span>
  </>
);

export default fitHelp;
