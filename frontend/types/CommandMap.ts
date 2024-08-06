export interface CommandMap {
  [key: string]:
    | JSX.Element
    | ((args: string) => JSX.Element | Promise<JSX.Element>);
}
