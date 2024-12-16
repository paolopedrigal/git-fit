import React from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactTerminal with SSR disabled
const ReactTerminal = dynamic(
  () => import("react-terminal").then((mod) => mod.ReactTerminal),
  { ssr: false }
);

export default function ReactTerminalClient({ ...props }) {
  return <ReactTerminal {...props} />;
}
