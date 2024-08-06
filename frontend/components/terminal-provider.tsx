"use client";

import * as React from "react";
import { TerminalContextProvider } from "react-terminal";

export default function TerminalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TerminalContextProvider>{children}</TerminalContextProvider>;
}
