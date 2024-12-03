const help = (
  <>
    {/* <span>NOT GNU bash, version 5.1.4(1)-release (x86_64-pc-linux-gnu)</span> */}
    <pre>
      Version 1.0-release by{" "}
      <span style={{ color: "white", textDecoration: "underline" }}>
        <a href="https://www.github.com/paolopedrigal/" target="_blank">
          paolopedrigal
        </a>
      </span>
      .
    </pre>
    <pre>These shell commands are defined internally.</pre>
    <br />
    <span>COMMANDS:</span>
    <pre style={{ marginLeft: "20px" }}>
      <strong style={{ color: "gold" }}>{"fit <command> [<args>]"}</strong>
    </pre>
    <pre style={{ marginLeft: "50px" }}>
      A version control-like interface for managing your workout entries.
    </pre>
    <br />
    <pre style={{ marginLeft: "50px" }}>Common commands:</pre>
    <pre style={{ marginLeft: "80px" }}>
      <strong>{"add".padEnd(22, " ")}</strong>Start workout.
    </pre>
    <pre style={{ marginLeft: "80px" }}>
      <strong>{"commit -m <message>".padEnd(22, " ")}</strong>Record workout
      with description.
    </pre>
    <pre style={{ marginLeft: "80px" }}>
      <strong>{"log".padEnd(22, " ")}</strong>Show a list of workout entries.
    </pre>
    <br />
    <pre style={{ marginLeft: "50px" }}>
      Use {'"fit --help"'} to show detailed information for fit commands.
    </pre>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong style={{ color: "gold" }}>clear</strong>
    </pre>
    <pre style={{ marginLeft: "50px" }}>Clear the terminal screen.</pre>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong style={{ color: "gold" }}>exit</strong>
    </pre>
    <pre style={{ marginLeft: "50px" }}>Sign out of shell.</pre>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      <strong style={{ color: "gold" }}>delete-account</strong>
    </pre>
    <pre style={{ marginLeft: "50px" }}>Permanently delete account.</pre>
  </>
);

export default help;
