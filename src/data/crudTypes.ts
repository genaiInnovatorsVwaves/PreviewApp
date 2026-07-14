export type CrudFieldType = "text" | "textarea" | "number" | "currency" | "date" | "select" | "email";

export type CrudTone = "green" | "amber" | "red" | "blue" | "slate" | "purple";

export interface CrudSelectOption {
  value: string;
  tone?: CrudTone;
}

export interface CrudField {
  key: string;
  label: string;
  type: CrudFieldType;
  required?: boolean;
  options?: CrudSelectOption[];
  placeholder?: string;
  suffix?: string;
  /** Renders as a colored status pill in the table (only meaningful for type: "select"). */
  isStatus?: boolean;
  /** Hide this field from the table view — still shown in the create/edit form. */
  hideInTable?: boolean;
}

export interface CrudRow {
  id: string;
  [key: string]: string | number;
}

export type CrudIconKey =
  | "receipt"
  | "fileText"
  | "server"
  | "mapPin"
  | "box"
  | "package"
  | "terminal"
  | "puzzle"
  | "calendarClock"
  | "building2"
  | "handshake"
  | "users"
  | "layers";

export interface CrudEntityConfig {
  key: string;
  label: string;
  labelPlural: string;
  icon: CrudIconKey;
  /** Field key rendered as the bold title column in the table. */
  primaryKey: string;
  fields: CrudField[];
  seedRows: CrudRow[];
}

export interface CrudStat {
  label: string;
  value: string;
  delta?: string;
  tone: "up" | "down" | "flat" | "warn";
  icon: CrudIconKey;
}

export interface CrudChart {
  kind: "bar" | "donut" | "line";
  title: string;
  bars?: { label: string; value: number }[];
  donut?: { label: string; value: number }[];
  lineA?: { label: string; value: number }[];
  lineB?: { label: string; value: number }[];
  lineLabelA?: string;
  lineLabelB?: string;
}

export interface CrudAppConfig {
  id: string;
  appName: string;
  tagline: string;
  gradientFrom: string;
  gradientTo: string;
  email: string;
  dashboardStats: CrudStat[];
  dashboardCharts: CrudChart[];
  entities: CrudEntityConfig[];
}
