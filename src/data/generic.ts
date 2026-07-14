import type { AppData, CatalogCard } from "./types";

export function generateGenericAppData(card: CatalogCard): AppData {
  const clean = card.description.replace(/\*\*/g, "");
  const pg = (label: string, options: string[], selected: string) => ({ label, options, selected });

  return {
    id: card.id,
    title: card.title,
    tagline: clean.split(".")[0] + ".",
    kind: "structured",
    chat: [
      { role: "user", text: `We need to scope out ${card.title}. Here's what it needs to do: ${clean}` },
      { role: "ai", text: `Got it — I'm capturing ${card.title} in the THINK stage. Let me confirm the core objective before I draft the architecture and entities.` },
      { role: "user", text: "That's right. It should plug into our existing enterprise data model like everything else on the platform." },
      { role: "ai", text: `Understood. I'm documenting the business overview, architecture, use cases, entities, and personas for ${card.title} now in the THINK stage.` },
    ],
    overview: {
      organization: `${card.title} is a module on the enterprise platform, owned by ${card.author}'s team, operating over the shared enterprise data model.`,
      challenges: [
        "Existing workflow for this domain is fragmented across manual processes",
        "No single system of record for this data today",
        "Limited visibility for stakeholders into throughput and exceptions",
      ],
      whyNeeded: clean,
      users: [
        { role: "Primary Operators", goals: "Use the application day-to-day to complete core workflows" },
        { role: "Managers & Supervisors", goals: "Oversee throughput, exceptions, and reporting" },
      ],
      goals: [
        "Centralize this domain's data and workflows in one platform",
        "Reduce manual, repetitive process steps",
        "Provide reporting and visibility to stakeholders",
      ],
      improvements: "Full success metrics were finalized during THINK-stage requirements gathering and signed off before build.",
      scope: ["Core workflow for this domain", "Standard reporting dashboard", "Role-based access control"],
      outOfScope: ["Advanced analytics (future phase)", "Third-party integrations beyond the core data model (future phase)"],
      painPoints: [{ title: "Manual Coordination", detail: "Teams coordinate this workflow manually today, outside any system of record" }],
      priorities: ["Core workflow", "Data model", "Reporting"],
      risks: [{ title: "Requirements may shift as usage grows", mitigation: "Iterative roadmap reviewed quarterly", level: "Low" }],
      dependencies: ["Access to the shared enterprise data model", "Stakeholder availability for requirements review"],
      assumptions: ["This module follows the same architecture conventions as the rest of the platform"],
    },
    architecture: {
      sections: [
        {
          title: "Infrastructure & Deployment",
          icon: "cloud",
          pillGroups: [
            pg("Deployment Mode", ["Cloud", "On-Premises", "Hybrid"], "Cloud"),
            pg("Cloud Provider", ["AWS", "Azure", "Google Cloud Platform", "Other"], "AWS"),
          ],
          toggles: [{ label: "High Availability", description: "Enable multi-zone deployment with auto-failover", on: true }],
        },
        {
          title: "Integrations & External Connectivity",
          icon: "plug",
          integrations: [{ name: "Enterprise Data Model", description: "Shared system of record across platform modules", direction: "Bidirectional" }],
        },
      ],
    },
    useCases: [
      {
        title: "Core Workflow",
        actor: "Primary Operator",
        description: "Complete the primary day-to-day task this application exists for.",
        priority: "High",
        trigger: "A new record needs to be created or actioned as part of the core workflow.",
        preconditions: ["User is authenticated", "User has Operator access to this application"],
        mainFlow: [
          "Operator opens the application and starts a new record",
          "Operator completes the required fields for the workflow",
          "System validates the record and updates its status",
          "Relevant stakeholders are notified of the update",
        ],
        acceptanceCriteria: [
          {
            given: "an Operator with valid access",
            when: "they submit a completed record",
            then: "the record is created and visible in the application within 1 minute",
          },
        ],
      },
      {
        title: "Review & Reporting",
        actor: "Manager",
        description: "Review throughput and exceptions via a reporting dashboard.",
        priority: "Medium",
        trigger: "A manager needs visibility into throughput or exceptions for their team.",
        preconditions: ["Manager is authenticated", "Manager has reporting access for this application"],
        mainFlow: [
          "Manager opens the reporting dashboard",
          "System aggregates current records into throughput and exception views",
          "Manager reviews flagged exceptions and drills into individual records as needed",
        ],
        acceptanceCriteria: [
          {
            given: "a Manager with reporting access",
            when: "they open the dashboard",
            then: "throughput and exceptions reflect data no more than a few minutes old",
          },
        ],
      },
    ],
    entities: [
      {
        name: "Record",
        description: "The primary entity this module manages.",
        fields: [
          { name: "id", type: "UUID", modifiers: ["Identifier", "Required"], notes: "Unique identifier", default: "auto-generated" },
          { name: "status", type: "String", modifiers: ["Required"], notes: "Workflow state" },
          { name: "created_at", type: "DateTime", modifiers: ["Required"], notes: "Creation timestamp", default: "current_timestamp" },
        ],
        validationRules: ["status must be one of the workflow states defined for this module", "created_at is immutable once the record is created"],
        relationships: [],
      },
    ],
    personas: [
      {
        name: card.author,
        role: "Requesting Stakeholder",
        avatarInitials: card.author.slice(0, 2).toUpperCase(),
        summary: `Initiated the request for ${card.title} and defined its requirements in the THINK stage.`,
        quote: `We needed ${card.title.toLowerCase()} to stop being a manual, ad hoc process.`,
        experienceLevel: "Requesting stakeholder",
        accessLevel: "Admin — full access to this application",
        goals: ["Get a working prototype through THINK → CREATE → OPERATE"],
        painPoints: ["Current process for this domain is manual or fragmented"],
        toolsToday: ["Spreadsheets", "Email"],
        successMetrics: ["This workflow moves off spreadsheets and into a single system of record"],
        typicalWorkflow: ["Reviews requirements captured in the THINK stage", "Confirms scope before the CREATE stage generates the application"],
      },
    ],
    createData: {
      uiux: {
        primaryColor: "#171717",
        secondaryColor: "#737373",
        accentColor: "#2563eb",
        headingFont: "Inter",
        bodyFont: "Inter",
        layoutType: pg("Layout Type", ["Fixed", "Fluid", "Hybrid"], "Fixed"),
        menuType: pg("Menu Type", ["Sidebar", "Topbar", "Hamburger"], "Sidebar"),
        menuBehavior: pg("Menu Behavior", ["Collapsible", "Fixed", "Overlay"], "Fixed"),
        menuPosition: pg("Menu Position", ["Left", "Right", "Top"], "Left"),
        cornerRadius: pg("Corner Radius", ["None", "Small", "Medium", "Large"], "Medium"),
        shadowStyle: pg("Shadow Style", ["None", "Soft", "Hard"], "Soft"),
        darkModeEnabled: false,
      },
      dataModel: {
        tables: [
          {
            name: "RECORDS",
            description: "The primary entity this module manages",
            fields: [
              { name: "ID", type: "Integer", modifier: "PK", validation: "required, unique", description: "Unique internal identifier" },
              { name: "STATUS_ID", type: "Reference", modifier: "FK", validation: "required", description: "References RECORD_STATUSES" },
              { name: "CUSTOMER_ID", type: "Integer", validation: "none", description: "Tenant/customer scope" },
              { name: "CREATED_TIME", type: "DateTime", validation: "none", analytics: "CURRENT_TIMESTAMP", description: "Record creation timestamp" },
              { name: "CREATOR", type: "Integer", validation: "none", description: "User who created this record" },
            ],
          },
          {
            name: "RECORD_STATUSES",
            description: "Valid workflow states a record can be in",
            fields: [
              { name: "ID", type: "Integer", modifier: "PK", validation: "required, unique", description: "Unique internal identifier" },
              { name: "CODE", type: "String", validation: "required, maxLength: 255", description: "Machine-readable code" },
              { name: "LABEL", type: "String", validation: "required, maxLength: 255", description: "Human-readable display label" },
            ],
          },
        ],
        positions: { RECORDS: { col: 0, row: 0 }, RECORD_STATUSES: { col: 1, row: 0 } },
        relationships: [{ from: "RECORDS", to: "RECORD_STATUSES", label: "STATUS ID" }],
      },
      workflows: [
        {
          title: "Core Workflow",
          description: "Primary end-to-end workflow for this module.",
          trigger: "A new record is created or an existing record changes state within this module.",
          sla: "TBD",
          level: "Manual + Assisted",
          personas: 2,
          rules: [
            "Records must pass required-field validation before entering the workflow.",
            "State transitions are restricted to the module's configured lifecycle map.",
          ],
          notifications: [
            { event: "Record created", channel: "In-app", recipient: "Primary Operator" },
            { event: "Record status changed", channel: "Email", recipient: "Manager" },
          ],
          steps: [
            { label: "Record Created or Updated", type: "start", actor: "Primary Operator" },
            { label: "Validate & Normalize Fields", type: "process", actor: "System" },
            { label: "Meets Routing Criteria", type: "decision", actor: "System" },
            { label: "Assign to Owner", type: "process", actor: "System" },
            { label: "Notify Stakeholders", type: "parallel", actor: "System" },
            { label: "Record Ready", type: "end", actor: "System" },
          ],
        },
      ],
      apiBaseUrl: `https://api.codesingularity.dev/${card.id}/v1`,
      apiVersion: "1.0.0",
      endpoints: [
        {
          method: "GET", path: "/records", summary: "List records", tag: "Records",
          description: `Returns records for ${card.title}, optionally filtered by status.`,
          parameters: [
            { name: "status", location: "query", type: "string", required: false, description: "Filter by workflow status" },
            { name: "page", location: "query", type: "integer", required: false, description: "Page number, 1-indexed" },
            { name: "limit", location: "query", type: "integer", required: false, description: "Page size — default 25, max 100" },
          ],
          responses: [{ status: 200, description: "Paginated list of records" }],
        },
        {
          method: "POST", path: "/records", summary: "Create record", tag: "Records",
          description: "Creates a new record, running the Intake Interpretation Agent against the submitted payload.",
          parameters: [{ name: "status", location: "body", type: "string", required: false, description: "Initial workflow state — defaults to the module's start state" }],
          responses: [
            { status: 201, description: "Record created" },
            { status: 400, description: "Missing required field or failed validation" },
          ],
        },
        {
          method: "GET", path: "/records/{id}", summary: "Get record details", tag: "Records",
          description: "Returns full details for a single record by its id.",
          parameters: [{ name: "id", location: "path", type: "integer", required: true, description: "RECORDS.ID" }],
          responses: [
            { status: 200, description: "Record details" },
            { status: 404, description: "No record with this id" },
          ],
        },
      ],
      aiAgents: [
        {
          name: "Intake Interpretation Agent",
          description: "Converts unstructured requests into structured records for this module.",
          trigger: "Fires when an unstructured request is submitted for intake into this module.",
          inputs: [{ name: "request.rawText", description: "Free-text description of the incoming request" }],
          outputs: [
            { name: "record.status", description: "Initial workflow state assigned to the structured record" },
            { name: "record.fields", description: "Structured fields extracted from the raw request text" },
          ],
        },
      ],
      accessRoles: [
        {
          name: "Primary Operator", description: "Uses the application day-to-day", scope: "Full access to records within this module",
          permissions: [{ resource: "Records", create: true, read: true, update: true, delete: false, approve: false }],
        },
        {
          name: "Manager", description: "Oversees throughput and reporting", scope: "Read access plus workflow sign-off",
          permissions: [{ resource: "Records", create: false, read: true, update: false, delete: false, approve: true }],
        },
      ],
      businessRules: [
        {
          name: "Record Validation Rule", entity: "Records",
          description: "Records must satisfy required-field validation before entering the workflow.",
          trigger: "A record is created or updated",
          condition: "One or more required fields fail validation",
          enforcement: "Blocks the write and returns a field-level validation error",
          severity: "High",
        },
        {
          name: "Assignment Routing Rule", entity: "Records",
          description: "Records are routed to an owner automatically based on this module's configured criteria.",
          trigger: "A record enters the workflow",
          condition: "The record matches this module's configured routing criteria",
          enforcement: "Auto-assigns the record to the appropriate owner",
          severity: "Medium",
        },
      ],
    },
    operateData: {
      integrations: [{ name: "Enterprise Data Model", description: "Shared system of record across platform modules", direction: "Bidirectional" }],
      meteringCategories: [
        { category: "Usage", metrics: [{ name: "Records Created", unit: "per record", description: "Billed per new record created in this module." }] },
      ],
      moduleGroups: [{ category: "Core", modules: [{ name: "Core Workflow", description: "Primary workflow for this module", enabled: true }] }],
      operationsConfig: [pg("Cloud Provider", ["AWS", "Azure", "GCP"], "AWS")],
      security: {
        authModes: pg("Primary Authentication Mode", ["Local Authentication", "SSO Only", "Hybrid Mode"], "Hybrid Mode"),
        ssoProtocols: ["SAML 2.0", "OAuth 2.0"],
        identityProviders: [{ name: "Okta", protocol: "SAML 2.0", domain: "company.okta.com", status: "Active" }],
        mfaPolicy: pg("MFA Enforcement Policy", ["Disabled", "Optional", "Required"], "Optional"),
      },
      previewBranding: {
        appName: card.title,
        tagline: "Enterprise application preview",
        gradientFrom: "#171717",
        gradientTo: "#2563eb",
        email: `${card.author.toLowerCase()}@codesingularity.dev`,
        roles: [{ name: "Admin", tagline: "Preview as Admin" }, { name: "Operator", tagline: "Preview as Operator" }],
      },
      actionStats: { entities: 2, endpoints: 3, pages: 3, useCases: 2, completion: 100 },
      actions: [
        { badge: "Quick Edit", title: "Edit Application", description: "Return to modify requirements in Think, Create, or Operate stages" },
        { badge: "Popular", title: "Generate Code", description: "Export production-ready codebase with full implementation" },
      ],
    },
    operatePreview: {
      kind: "structured",
      appName: card.title,
      navItems: ["Home", "Records", "Users"],
      stats: [
        { label: "Records", value: "128", delta: "+4%", tone: "up" },
        { label: "Open Items", value: "12", delta: "-2%", tone: "up" },
      ],
      charts: {
        stageTitle: "Records by Stage",
        stageBars: [
          { label: "New", value: 4, color: "" },
          { label: "In Progress", value: 6, color: "" },
          { label: "Done", value: 8, color: "" },
        ],
        typeTitle: "Record Distribution by Type",
        typeSlices: [
          { label: "Type A", value: 5, color: "" },
          { label: "Type B", value: 3, color: "" },
        ],
        trendTitle: "Weekly Throughput Trend",
        trendLabelA: "Created",
        trendLabelB: "Completed",
        trendA: [
          { label: "Mon", value: 4 },
          { label: "Tue", value: 5 },
          { label: "Wed", value: 6 },
          { label: "Thu", value: 5 },
          { label: "Fri", value: 7 },
        ],
        trendB: [
          { label: "Mon", value: 2 },
          { label: "Tue", value: 3 },
          { label: "Wed", value: 3 },
          { label: "Thu", value: 4 },
          { label: "Fri", value: 4 },
        ],
        riskTitle: "Risk Distribution",
        riskBars: [
          { label: "Low", value: 6, color: "" },
          { label: "Medium", value: 2, color: "" },
          { label: "High", value: 1, color: "" },
        ],
      },
      tableTitle: "Recent Records",
      columns: [{ key: "id", label: "ID" }, { key: "owner", label: "Owner" }],
      rows: [{ id: "REC-0001", cells: { owner: card.author }, status: "Active", statusTone: "blue" }],
    },
  };
}
