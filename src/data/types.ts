export type AppKind = "chat" | "structured";

export type PlatformKey = "nsi" | "osi" | "esi" | "nsm" | "osm" | "esm";

export interface CatalogCard {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  minutesAgo: number;
  featured?: AppKind;
  /** Which branded platform catalogs (NetSingularity, OpsSingularity, EnterpriseSingularity) this app appears in. Omit or leave as default ["nsi"] for the general catalog. */
  platforms?: PlatformKey[];
}

export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export interface Persona {
  role: string;
  goals: string;
}

export interface RiskItem {
  title: string;
  mitigation: string;
  level: "Low" | "Medium" | "High";
}

export interface PainPoint {
  title: string;
  detail: string;
}

export interface Overview {
  organization: string;
  challenges: string[];
  whyNeeded: string;
  users: Persona[];
  goals: string[];
  improvements: string;
  scope: string[];
  outOfScope: string[];
  painPoints: PainPoint[];
  priorities: string[];
  risks: RiskItem[];
  dependencies: string[];
  assumptions: string[];
}

// ---- Architecture: real config-form shape (pill selects, toggles, checkboxes, integrations) ----
export interface PillGroup {
  label: string;
  options: string[];
  selected: string;
}

export interface ToggleItem {
  label: string;
  description: string;
  on: boolean;
}

export interface IntegrationCard {
  name: string;
  description: string;
  direction: "Bidirectional" | "Inbound" | "Outbound";
}

export interface ArchSection {
  title: string;
  icon: "cloud" | "eye" | "database" | "shield" | "plug";
  pillGroups?: PillGroup[];
  toggles?: ToggleItem[];
  checkboxes?: string[];
  integrations?: IntegrationCard[];
}

export interface Architecture {
  sections: ArchSection[];
}

export interface AcceptanceCriterion {
  given: string;
  when: string;
  then: string;
}

export interface UseCase {
  title: string;
  actor: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  trigger: string;
  preconditions: string[];
  mainFlow: string[];
  acceptanceCriteria: AcceptanceCriterion[];
}

export interface EntityField {
  name: string;
  type: string;
  modifiers: string[];
  notes: string;
  default?: string;
}

export interface EntityRelation {
  name: string;
  description: string;
}

export interface StateTransition {
  from: string;
  to: string;
  condition: string;
}

export interface Entity {
  name: string;
  description: string;
  fields: EntityField[];
  relationships: EntityRelation[];
  validationRules: string[];
  lifecycle?: StateTransition[];
  group?: string;
}

export interface PersonaDetail {
  name: string;
  role: string;
  avatarInitials: string;
  summary: string;
  quote: string;
  experienceLevel: string;
  accessLevel: string;
  goals: string[];
  painPoints: string[];
  toolsToday: string[];
  successMetrics: string[];
  typicalWorkflow: string[];
}

// ---- Create stage ----
export interface UIUXConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  layoutType: PillGroup;
  menuType: PillGroup;
  menuBehavior: PillGroup;
  menuPosition: PillGroup;
  cornerRadius: PillGroup;
  shadowStyle: PillGroup;
  darkModeEnabled: boolean;
}

export interface DataDictionaryField {
  name: string;
  type: "Integer" | "String" | "Journal" | "Reference" | "DateTime" | "Boolean" | "Decimal";
  modifier?: "PK" | "FK" | "UK";
  validation: string;
  analytics?: string;
  description: string;
}

export interface DataDictionaryEntity {
  name: string;
  description: string;
  fields: DataDictionaryField[];
}

export interface ERRelationship {
  from: string;
  to: string;
  label: string;
}

export interface ERTablePosition {
  col: number;
  row: number;
}

export interface DataModel {
  tables: DataDictionaryEntity[];
  positions: Record<string, ERTablePosition>;
  relationships: ERRelationship[];
}

export interface WorkflowStep {
  label: string;
  type: "start" | "process" | "decision" | "parallel" | "end";
  actor: string;
}

export interface WorkflowNotification {
  event: string;
  channel: string;
  recipient: string;
}

export interface WorkflowItem {
  title: string;
  description: string;
  trigger: string;
  sla: string;
  level: string;
  personas: number;
  rules: string[];
  notifications: WorkflowNotification[];
  steps: WorkflowStep[];
}

export interface ApiParameter {
  name: string;
  location: "path" | "query" | "body" | "header";
  type: string;
  required: boolean;
  description: string;
}

export interface ApiResponseCase {
  status: number;
  description: string;
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  summary: string;
  description: string;
  tag: string;
  parameters: ApiParameter[];
  responses: ApiResponseCase[];
}

export interface AIAgentIO {
  name: string;
  description: string;
}

export interface AIAgentItem {
  name: string;
  description: string;
  trigger: string;
  inputs: AIAgentIO[];
  outputs: AIAgentIO[];
}

export interface PermissionRow {
  resource: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
}

export interface AccessRole {
  name: string;
  description: string;
  scope: string;
  permissions: PermissionRow[];
}

export interface BusinessRule {
  name: string;
  description: string;
  entity: string;
  trigger: string;
  condition: string;
  enforcement: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

export interface CreateData {
  uiux: UIUXConfig;
  dataModel: DataModel;
  workflows: WorkflowItem[];
  apiBaseUrl: string;
  apiVersion: string;
  endpoints: ApiEndpoint[];
  aiAgents: AIAgentItem[];
  accessRoles: AccessRole[];
  businessRules: BusinessRule[];
}

// ---- Operate stage ----
export interface MeteringMetric {
  name: string;
  unit: string;
  description: string;
}

export interface MeteringCategory {
  category: string;
  metrics: MeteringMetric[];
}

export interface ModuleItem {
  name: string;
  description: string;
  enabled: boolean;
}

export interface ModuleGroup {
  category: string;
  modules: ModuleItem[];
}

export interface IdentityProvider {
  name: string;
  protocol: string;
  domain: string;
  status: "Active" | "Pending";
}

export interface RoleOption {
  name: string;
  tagline: string;
}

export interface PreviewBranding {
  appName: string;
  tagline: string;
  gradientFrom: string;
  gradientTo: string;
  email: string;
  roles: RoleOption[];
}

export interface ActionItem {
  badge: string;
  title: string;
  description: string;
}

export interface OperateData {
  integrations: IntegrationCard[];
  meteringCategories: MeteringCategory[];
  moduleGroups: ModuleGroup[];
  operationsConfig: PillGroup[];
  security: {
    authModes: PillGroup;
    ssoProtocols: string[];
    identityProviders: IdentityProvider[];
    mfaPolicy: PillGroup;
  };
  previewBranding: PreviewBranding;
  actionStats: { entities: number; endpoints: number; pages: number; useCases: number; completion: number };
  actions: ActionItem[];
}

// ---- Preview app (the actual generated, standalone application) ----
export interface StatTile {
  label: string;
  value: string;
  delta?: string;
  tone: "up" | "down" | "flat" | "warn";
}

export interface StructuredRow {
  id: string;
  cells: Record<string, string>;
  status: string;
  statusTone: "green" | "amber" | "red" | "blue" | "muted";
}

export interface ChartBar {
  label: string;
  value: number;
  color: string;
}

export interface ChartSeriesPoint {
  label: string;
  value: number;
}

export interface PreviewCharts {
  stageTitle: string;
  stageBars: ChartBar[];
  typeTitle: string;
  typeSlices: ChartBar[];
  trendTitle: string;
  trendLabelA: string;
  trendLabelB: string;
  trendA: ChartSeriesPoint[];
  trendB: ChartSeriesPoint[];
  riskTitle: string;
  riskBars: ChartBar[];
}

export interface StructuredPreview {
  kind: "structured";
  appName: string;
  navItems: string[];
  stats: StatTile[];
  charts: PreviewCharts;
  tableTitle: string;
  columns: { key: string; label: string }[];
  rows: StructuredRow[];
}

export interface ChatPreviewMessage {
  from: "user" | "bot";
  text: string;
  time: string;
}

export interface ChatPreview {
  kind: "chat";
  appName: string;
  navItems: string[];
  assistantName: string;
  channels: string[];
  suggestedPrompts: string[];
  conversation: ChatPreviewMessage[];
}

export type OperatePreview = StructuredPreview | ChatPreview;

// ---- Document gallery (Git-import → generated-documentation Think stage) ----
export interface ProcessStepInfo {
  label: string;
  description: string;
}

export interface DocSection {
  id: string;
  title: string;
  level: 1 | 2;
  paragraphs: string[];
}

export interface GeneratedDocument {
  key: string;
  icon: "hld" | "lld" | "brd" | "prd" | "feature" | "api" | "testplan" | "testcases" | "dataflow" | "traceability" | "coverage" | "summary" | "provenance" | "tutorial";
  title: string;
  description: string;
  readMinutes: number;
  sections: DocSection[];
}

export interface DocumentGalleryData {
  repoUrl: string;
  repoName: string;
  processSteps: ProcessStepInfo[];
  events: string[];
  documents: GeneratedDocument[];
}

export interface AppData {
  id: string;
  title: string;
  tagline: string;
  kind: AppKind;
  chat: ChatMessage[];
  overview: Overview;
  architecture: Architecture;
  useCases: UseCase[];
  entities: Entity[];
  personas: PersonaDetail[];
  createData: CreateData;
  operateData: OperateData;
  operatePreview: OperatePreview;
  /** When set, "Preview" launches this real external URL instead of the internal simulated /preview/:id page. */
  externalPreviewUrl?: string;
  /** When set, the Think stage renders a generated-documentation gallery (Git-import flow) instead of the Overview/Architecture/Use Cases/Entities/Persona tabs. */
  documentGallery?: DocumentGalleryData;
}
