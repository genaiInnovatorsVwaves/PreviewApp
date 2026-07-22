import {
  RadioTower,
  ShieldAlert,
  Leaf,
  Users,
  Smile,
  DollarSign,
  Handshake,
  Truck,
  GitBranch,
  Webhook,
  FileText,
  HardHat,
  Cpu,
  CalendarClock,
  Megaphone,
  KeyRound,
  Target,
  Layers,
  Briefcase,
  Flame,
  Database,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

/** vw-chip semantic variant (minus the `vw-chip--` prefix) used to tint a card's icon badge. */
export type CardChipTone =
  | "info"
  | "error"
  | "success"
  | "purple"
  | "pink"
  | "orange"
  | "cyan"
  | "neutral";

interface VisualRule {
  test: RegExp;
  icon: LucideIcon;
  tone: CardChipTone;
}

// Checked in order, first match wins — ordered roughly from most specific/domain-distinctive
// keywords to more generic ones, so e.g. "Customer Onboarding Orchestrator" hits "customer"
// before a generic "onboarding" rule could steal it.
const RULES: VisualRule[] = [
  // Product lifecycle / requirements-to-release platforms
  { test: /\b(product lifecycle|product & plan)\b/i, icon: Layers, tone: "cyan" },

  // M&A / corporate deal rooms
  { test: /\b(m&a|due diligence)\b/i, icon: Briefcase, tone: "neutral" },

  // Oil & gas / energy
  { test: /\b(oil & gas|oil and gas)\b/i, icon: Flame, tone: "orange" },

  // Telecom / network
  { test: /\b(ran|5g|spectrum|cell site|tower lease|tower & asset|roaming|sim\b|volte|voip|ussd|sms|mms|hlr|hss|ims\b|number port|porting|portability|e911|backhaul|network|radio|subscriber|charging|prepaid|cdr|apn|interconnect|wholesale capacity|telecom|voicemail)\b/i, icon: RadioTower, tone: "info" },

  // Risk / security / compliance / audit / fraud
  { test: /\b(risk|compliance|audit|fraud|vulnerability|insider threat|security|incident|threat|governance committee|lawful intercept)\b/i, icon: ShieldAlert, tone: "error" },

  // Access / identity
  { test: /\b(access|identity|sso|auth|mfa|secrets?|rbac|badging)\b/i, icon: KeyRound, tone: "error" },

  // ESG / sustainability (not "Blue-Green" deployment tooling — that's DevOps, handled below)
  { test: /\b(esg|sustainab|environmental|green network|green ops|energy optimizer)\b/i, icon: Leaf, tone: "success" },

  // HR / talent / workforce
  { test: /\b(talent|workforce|employee|hiring|training|certification|knowledge transfer|lessons learned)\b/i, icon: Users, tone: "purple" },

  // Customer / CX / sales / marketing
  { test: /\b(customer|client|churn|loyalty|cx\b|dealer|retail store)\b/i, icon: Smile, tone: "pink" },
  { test: /\b(sales|marketing|campaign|commission)\b/i, icon: Megaphone, tone: "pink" },

  // Finance / billing / budget
  { test: /\b(revenue|billing|invoice|budget forecast|budget variance|budget vs|cost|expense|payment|chargeback|pricing|price plan|tariff|fp&a|finops|capital expenditure|capex|dunning|collections|earned value|grant|funding)\b/i, icon: DollarSign, tone: "orange" },

  // Procurement / vendor / supply chain / logistics / facilities
  { test: /\b(procurement|vendor|supplier|rfp|purchase order|bid comparison)\b/i, icon: Handshake, tone: "orange" },
  { test: /\b(supply chain|logistics|warehouse|shipment|fleet|equipment|asset|inventory|warranty)\b/i, icon: Truck, tone: "orange" },
  { test: /\b(facilities|site safety|site access|inspection|permit|construction|construct|real estate)\b/i, icon: HardHat, tone: "orange" },

  // IoT / devices
  { test: /\b(iot|device|sensor)\b/i, icon: Cpu, tone: "cyan" },

  // Database / data reliability
  { test: /\b(database|db reliability)\b/i, icon: Database, tone: "cyan" },

  // DevOps / platform engineering / infra
  { test: /\b(kubernetes|cluster|container|terraform|pipeline|deploy|canary|chaos|devsecops|managedserviceops|internal developer|artifact registry|build |sandbox|gpu|node pool|service mesh|observability|log pipeline|config drift|environment|feature flag|blue-green|disaster recovery|dr failover|capacity forecast|capacity planning|data center capacity|\bcli\b|alert|monitoring|synthetic|\bslo\b)/i, icon: GitBranch, tone: "cyan" },
  { test: /\b(api|gateway|webhook|integration)\b/i, icon: Webhook, tone: "cyan" },

  // Documents / legal / knowledge
  { test: /\b(document|contract|knowledge base|legal|repository|archive)\b/i, icon: FileText, tone: "neutral" },

  // Scheduling
  { test: /\b(on-call|scheduler|schedule)\b/i, icon: CalendarClock, tone: "neutral" },

  // Project / program / portfolio
  { test: /\b(project|program|portfolio|milestone|charter|roadmap|stakeholder|okr|agile|kickoff|gate review|stage-gate|change enablement|change management|resource capacity|resource allocation|resource utilization)\b/i, icon: Target, tone: "neutral" },
];

const DEFAULT_RULE: Omit<VisualRule, "test"> = { icon: LayoutGrid, tone: "neutral" };

export function getCardVisual(title: string): { Icon: LucideIcon; tone: CardChipTone } {
  const rule = RULES.find((r) => r.test.test(title));
  return rule ? { Icon: rule.icon, tone: rule.tone } : { Icon: DEFAULT_RULE.icon, tone: DEFAULT_RULE.tone };
}
