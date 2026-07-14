import {
  Receipt,
  FileText,
  Server,
  MapPin,
  Box,
  Package,
  Terminal,
  Puzzle,
  CalendarClock,
  Building2,
  Handshake,
  Users,
  Layers,
  type LucideIcon,
} from "lucide-react";
import type { CrudIconKey } from "../../../data/crudTypes";

export const CRUD_ICONS: Record<CrudIconKey, LucideIcon> = {
  receipt: Receipt,
  fileText: FileText,
  server: Server,
  mapPin: MapPin,
  box: Box,
  package: Package,
  terminal: Terminal,
  puzzle: Puzzle,
  calendarClock: CalendarClock,
  building2: Building2,
  handshake: Handshake,
  users: Users,
  layers: Layers,
};
