const witError = (
  <span>
    <span>
      Invalid command or options. Use the following usage guidelines:
      <br />
    </span>
    <br />
    <pre style={{ marginLeft: "20px" }}>
      wit add
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      wit commit -m {"<"}message{">"}
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      wit log {"["}--oneline | --week | --month | --year-month {"<"}YYYY-MM
      {">]"}
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      wit status
      <br />
    </pre>
    <pre style={{ marginLeft: "20px" }}>
      wit reset {"["}--delete {"<"}YYYY-MM-DD{">]"}
      <br />
    </pre>
    <br />
    <span>
      Enter <strong>wit --help</strong> for more information.
    </span>
  </span>
);

export default witError;
