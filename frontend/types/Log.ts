export interface LogBase {
  description: string;
  log_date: string;
  log_time: string;
  duration_minutes: number;
}

export interface Log extends LogBase {
  author_id: string;
  id: string;
}
