const fitError = (
  <span>
    <span>
      Invalid command or options. Use the following usage guidelines:
      <br />
    </span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      fit add
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      fit commit -m {"<"}message{">"}
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      fit log {"["}--oneline | --week | --month | --year-month {"<"}YYYY-MM
      {">]"}
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      fit status
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      fit reset {"["}--delete {"<"}YYYY-MM-DD{">]"}
      <br />
    </pre>
    <br />
    <span>
      Enter <strong>fit --help</strong> for more information.
    </span>
  </span>
);

export default fitError;
