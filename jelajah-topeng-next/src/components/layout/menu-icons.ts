import {
  Bell,
  BookOpen,
  CalendarDays,
  CircleHelp,
  Compass,
  CreditCard,
  Landmark,
  LayoutDashboard,
  Receipt,
  Ticket,
  TrendingUp,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { PageId } from "@/lib/menu";

export const MENU_ICONS: Record<PageId, LucideIcon> = {
  dashboard: LayoutDashboard,
  exploration: Compass,
  panji: Landmark,
  materi: BookOpen,
  booking: CalendarDays,
  progres: TrendingUp,
  ticketing: Ticket,
  payment: CreditCard,
  refund: Receipt,
  notification: Bell,
  faq: CircleHelp,
  users: Users,
  profile: UserCog,
};
