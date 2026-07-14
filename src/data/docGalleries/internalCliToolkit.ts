import type { DocumentGalleryData, DocSection, GeneratedDocument } from "../types";

function sec(id: string, title: string, level: 1 | 2, paragraphs: string[]): DocSection {
  return { id, title, level, paragraphs };
}

const documents: GeneratedDocument[] = [
  {
    key: "hld",
    icon: "hld",
    title: "High level design",
    description: "Architecture overview, major modules, and system boundaries.",
    readMinutes: 9,
    sections: [
      sec("1", "Executive Summary", 1, [
        `devcli is the single command-line entry point for the engineering organization, reverse-engineered here from its Rust source tree (54 KLOC across the core binary, excluding vendored crates). It replaced a sprawl of 30+ one-off shell and Python scripts that individual teams had accumulated for deploys, debugging, scaffolding, auth, config management, and data operations. It now ships to roughly 2,400 active developers via a Homebrew tap and an internal package manager, and handles approximately 312,000 command invocations per week in production telemetry.`,
        `The binary is a single static executable with no runtime dependency install step, which was a deliberate reaction to the prior state where each team's script required its own Python virtualenv or Node version. Startup latency is held under 40ms cold on the reference CI runner, which matters at this invocation volume — even a 200ms regression would cost the organization roughly 17 developer-hours per week in aggregate.`,
      ]),
      sec("2", "Architecture Overview", 1, [
        `Five core modules do the work: command-dispatcher resolves the invoked category and command name against a compiled command registry; config-resolver merges configuration across four layers (CLI flag, environment variable, project-local \`.devcli.toml\`, and global \`~/.config/devcli/config.toml\`) with strict precedence; plugin-loader sandboxes and executes third-party plugin binaries compiled to WASM; auth-session-manager mints and caches short-lived service tokens; and telemetry-emitter batches usage events and ships them to the internal analytics pipeline on a 30-second flush interval.`,
        `Static analysis of the call graph shows command-dispatcher as the highest-fan-in module (every command path routes through it), while plugin-loader is deliberately the most isolated — it communicates with the rest of the binary only through a narrow host-function ABI, which is the security boundary the org relies on to let third-party teams ship plugins without a central review gate on every change.`,
      ]),
      sec("3", "Key Design Decisions", 1, [
        `Plugins are compiled to WASM rather than loaded as native dynamic libraries specifically so a misbehaving or malicious plugin cannot access memory or syscalls outside the capabilities it was explicitly granted at install time. This was a direct response to an early incident (pre-dates this repository's history per the commit log) where a native-plugin prototype was able to read unrelated environment variables, including credentials.`,
        `Configuration precedence (flag > env > project config > global config) mirrors the convention used by the org's existing infra tooling, so engineers moving between devcli and, for example, the Terraform module tooling don't have to re-learn a different override model.`,
      ]),
      sec("4", "Scope of This Analysis", 1, [
        `This documentation set covers the core binary and the plugin SDK surface. It does not cover the analytics pipeline that ingests telemetry-emitter's output, or the internal package manager's own release infrastructure — both are separate repositories outside this reverse-engineering pass.`,
      ]),
    ],
  },
  {
    key: "lld",
    icon: "lld",
    title: "Low level design",
    description: "Detailed components, interfaces, and implementation structure.",
    readMinutes: 12,
    sections: [
      sec("1", "Command Registry", 1, [
        `\`CommandRegistry\` is a compile-time-populated map from a dotted command path (e.g. \`deploy:rollback\`, \`debug:tail-logs\`) to a handler struct implementing the internal \`Command\` trait. Each entry also carries the metadata surfaced in the catalog view — category, a one-line description, and a \`CommandStatus\` enum (\`Stable\`, \`Beta\`, \`Deprecated\`, \`Experimental\`) that drives both help-text formatting and the deprecation-warning path described in the Feature Specification.`,
        `Registry entries are generated from a build-time macro that scans a \`commands/\` directory convention, so adding a new core command does not require hand-editing a central dispatch table — a deliberate choice that shows up in the commit history as reducing merge-conflict-driven review friction once command count crossed roughly 40.`,
      ]),
      sec("2", "Config Layer Resolution", 1, [
        `\`ConfigLayer\` is resolved by loading all four sources into an ordered vector and folding them left-to-right, where a later layer's present key always overwrites an earlier layer's value for that key — arrays are replaced wholesale rather than merged, which is called out explicitly in the Tutorial because it is the single most common support question the DevEx team fields.`,
        `The global config file is read once per process and cached; project config is re-read per invocation to pick up changes without requiring a shell restart, which was a specific fix for a recurring complaint that flag-only workarounds were needed after editing \`.devcli.toml\`.`,
      ]),
      sec("3", "Plugin Manifest and Sandbox Boundary", 1, [
        `\`PluginManifest\` is a TOML file bundled alongside each plugin's compiled WASM module, declaring the plugin's registered command names, the permission scopes it requests (e.g. \`network:read\`, \`fs:project-root\`, \`env:read:AWS_*\`), and its semantic version. plugin-loader parses and validates this manifest before instantiating the WASM module, and any capability not explicitly declared is denied at the host-function boundary rather than at the plugin's own discretion.`,
        `The host-function ABI exposed to plugins is intentionally small — it is the set of functions documented in the Plugin SDK reference below. Anything a plugin needs that isn't on that list has to go through a permission-gated host call, which is why plugin review focuses on the manifest's requested scopes rather than auditing every line of a plugin's own logic.`,
      ]),
      sec("4", "Telemetry Batching", 1, [
        `telemetry-emitter buffers command-invocation events (command path, duration, exit code, anonymized invoker ID) in memory and flushes in batches every 30 seconds or when the buffer reaches 200 events, whichever comes first, over an async POST to the internal analytics pipeline. Failed flushes are retried with exponential backoff and are persisted to a local spool file so a network blip doesn't silently drop usage data — this is the mechanism behind the weekly-invocation dashboards referenced throughout this document set.`,
      ]),
      sec("5", "Error Handling", 1, [
        `Errors are normalized to a small internal \`CliError\` enum at each module boundary and rendered to a consistent human-readable format at the top-level handler, with a machine-readable \`--json\` error mode for CI callers. Plugin-originated errors are wrapped separately so a stack trace never leaks WASM-runtime internals to the terminal.`,
      ]),
    ],
  },
  {
    key: "brd",
    icon: "brd",
    title: "Business requirements",
    description: "Business goals, stakeholders, and functional requirements.",
    readMinutes: 8,
    sections: [
      sec("1", "Business Goals", 1, [
        `The primary quantified goal behind devcli's creation was cutting new-hire time-to-first-successful-deploy from an observed baseline of roughly 4 days — spent locating and learning whichever team's bespoke script happened to be current — down to under a day. Post-rollout survey data referenced in the project's retro notes puts the current median at approximately 6 hours, largely attributed to a single discoverable \`devcli\` entry point with built-in \`--help\` at every level.`,
        `A secondary, harder-to-quantify goal was reducing the maintenance burden on individual teams who had been informally responsible for scripts nobody else understood. Consolidating 30+ scripts into a plugin architecture means ownership is now explicit and declared in each plugin's manifest, rather than implicit in whoever last touched the file.`,
      ]),
      sec("2", "Stakeholders", 1, [
        `The Developer Experience (DevEx) team, roughly 6 engineers, owns the core binary, the command-dispatcher, config-resolver, and plugin-loader modules, and the release pipeline that publishes new versions to the Homebrew tap and internal package manager.`,
        `Platform Engineering Director — sponsors the roadmap and reviews the quarterly invocation-volume and onboarding-time metrics this system produces. Security Engineering Lead — reviews the plugin permission-scope model and is a required approver on any change that widens the host-function ABI plugins can call. VP, Developer Experience — owns the business case and the org-wide "one CLI" mandate that made adoption non-optional for new tooling.`,
      ]),
      sec("3", "Functional Requirements", 1, [
        `REQ-01: Unify deploy, debug, scaffold, auth, config, and data operations behind one discoverable, versioned command surface. REQ-02: Third-party plugins must execute in a sandbox that cannot access resources outside their declared permission scopes. REQ-03: Configuration must resolve deterministically across flag, environment, project, and global layers. REQ-04: Command usage must be observable in aggregate for adoption and deprecation planning, without capturing command arguments that may contain secrets. REQ-05: Commands must support a formal deprecation lifecycle that warns callers before removal.`,
      ]),
    ],
  },
  {
    key: "prd",
    icon: "prd",
    title: "Product requirements",
    description: "Product scope, user stories, and acceptance criteria.",
    readMinutes: 10,
    sections: [
      sec("1", "Scope", 1, [
        `In scope: the core binary's command dispatch, config resolution, plugin sandboxing, auth session handling, and telemetry emission. Also in scope: the plugin authoring SDK and the \`devcli plugin scaffold\` bootstrap flow. Out of scope: the analytics pipeline's own storage and dashboarding layer, and the internal package manager's distribution mechanics — both are separate systems this binary integrates with but does not implement.`,
      ]),
      sec("2", "User Stories", 1, [
        `As a new hire, I need one command to discover every available operation relevant to my team, so I don't have to ask a teammate which of several scripts is still maintained. Acceptance: \`devcli --help\` lists every command grouped by \`category\`, and each command's \`status\` badge (Stable / Beta / Deprecated / Experimental) is visible inline.`,
        `As a plugin author, I need to register a new subcommand without a central-team review gate on ordinary logic changes, so my team can iterate independently. Acceptance: a plugin whose manifest requests only previously-approved permission scopes can be published to the internal registry without a DevEx-team sign-off; a manifest requesting a new scope requires Security Engineering approval.`,
        `As a platform operator, I need commands nearing end-of-life to warn callers before they're removed, so downstream automation isn't broken without notice. Acceptance: invoking a command with \`status: "Deprecated"\` prints a warning to stderr (not stdout, so it doesn't corrupt piped output) naming the replacement command, and still executes successfully.`,
        `As a security reviewer, I need to see exactly what a plugin can access before it's published, so I can approve or reject based on declared scope rather than a full code audit. Acceptance: \`devcli plugin inspect <name>\` prints the parsed manifest's permission scopes in human-readable form.`,
        `As an engineer debugging a production incident, I need to stream and filter logs without leaving my terminal for a separate log-aggregation UI. Acceptance: \`debug:tail-logs\` accepts \`--service\` and \`--severity\` flags and streams matching lines with sub-second latency from the aggregation backend.`,
      ]),
    ],
  },
  {
    key: "feature",
    icon: "feature",
    title: "Feature specification",
    description: "Feature behavior, inputs, outputs, and edge cases.",
    readMinutes: 11,
    sections: [
      sec("1", "Configuration Precedence Resolution", 1, [
        `When a value is requested by key, config-resolver checks, in order, the matching CLI flag, then the matching environment variable (prefixed \`DEVCLI_\`), then the project-local \`.devcli.toml\`, then the global config — returning the first layer where the key is present. This is fully deterministic and does not attempt to merge partial values across layers for a single key; only distinct keys from different layers are combined into the effective configuration.`,
        `Edge case: if a project config sets a key to an explicit empty string, that counts as "present" and short-circuits the fallback to global config — a behavior the Tutorial calls out because it has surprised engineers expecting empty-string-means-unset semantics.`,
      ]),
      sec("2", "Plugin Sandboxing and Permission Model", 1, [
        `On install, plugin-loader parses the plugin's manifest and presents the requested permission scopes for approval (either interactively on first run, or pre-approved via the internal registry's review flow for org-published plugins). At execution time, any host-function call outside the approved scope set returns a permission-denied error to the plugin rather than crashing the host process.`,
        `Edge case: a plugin that exceeds its sandboxed memory limit (128MB default, configurable per-manifest up to 512MB with Security Engineering approval) is terminated by plugin-loader and the event is both surfaced to the invoking user and recorded via telemetry-emitter for the plugin's maintainer to investigate.`,
      ]),
      sec("3", "Deprecation Warning Behavior", 1, [
        `A command with \`status: "Deprecated"\` still executes fully — devcli never silently blocks a deprecated command — but prints a one-line warning to stderr naming the deprecation and, where known, its replacement command, once per invocation. This is deliberately not rate-limited or suppressible via a global flag, so CI logs retain a visible trail of continued usage that the owning team can use to prioritize migration outreach.`,
      ]),
    ],
  },
  {
    key: "api",
    icon: "api",
    title: "Plugin SDK reference",
    description: "The host-function interface a plugin author implements and calls against.",
    readMinutes: 13,
    sections: [
      sec("1", "Registration Hooks", 1, [
        `\`registerCommand(name: &str, handler: CommandHandler)\` — declares a subcommand the plugin owns; \`name\` must match an entry in the plugin's manifest or registration fails at load time. \`registerFlag(command: &str, flag: FlagSpec)\` — declares a flag accepted by one of the plugin's commands, validated and parsed by the host before the plugin's handler runs.`,
      ]),
      sec("2", "Lifecycle Hooks", 1, [
        `\`onBeforeExecute(ctx: &ExecContext) -> Result<(), CliError>\` — invoked immediately before the plugin's handler runs; returning an error aborts execution before any of the plugin's own logic runs. \`onAfterExecute(ctx: &ExecContext, result: &CommandResult)\` — invoked after the handler completes, commonly used for plugin-side telemetry or cleanup.`,
      ]),
      sec("3", "Host Capability Calls", 1, [
        `\`requestPermission(scope: PermissionScope) -> bool\` — checks (does not request at runtime — approval happens at install) whether the plugin holds a given scope; used defensively before attempting an operation that requires it. \`readConfig(key: &str) -> Option<String>\` — reads through the same four-layer config-resolver used by core commands, scoped to keys under the plugin's own namespace. \`writeCache(key: &str, value: &[u8], ttl_secs: u32)\` / \`readCache(key: &str) -> Option<Vec<u8>>\` — a sandboxed key-value cache scoped per-plugin, backed by a local file the plugin cannot read outside its own namespace.`,
        `\`emitTelemetry(event: TelemetryEvent)\` — routes a plugin-defined event through the same batching pipeline telemetry-emitter uses for core commands, subject to the same PII-scrubbing rules. \`promptUser(message: &str) -> String\` — the only sanctioned way for a plugin to read interactive stdin, so the host can guarantee prompts are never issued from a non-TTY context (e.g. CI). \`exitWithError(code: i32, message: &str) -> !\` — terminates with the host's standard error-formatting rather than a raw panic, keeping plugin failures visually consistent with core-command failures.`,
      ]),
      sec("4", "Manifest Schema", 1, [
        `Every plugin ships a \`plugin.toml\` declaring \`name\`, \`version\` (semver), \`commands\` (array of command names the plugin registers), and \`permissions\` (array of requested scopes, e.g. \`network:read\`, \`fs:project-root\`, \`env:read:AWS_*\`). plugin-loader rejects any manifest referencing a command name not declared, or a permission scope it does not recognize.`,
      ]),
    ],
  },
  {
    key: "testplan",
    icon: "testplan",
    title: "Test plan",
    description: "Test scenarios, coverage targets, and validation steps.",
    readMinutes: 9,
    sections: [
      sec("1", "Test Strategy", 1, [
        `Testing is layered: unit tests around command-dispatcher's routing logic and config-resolver's precedence rules run on every commit; integration tests spin up the plugin-loader against real compiled WASM fixture plugins (including deliberately malicious fixtures that attempt to exceed their declared scope) in CI; a smaller set of end-to-end tests exercises the packaged binary against a sandboxed auth and telemetry backend before each release.`,
        `Security-relevant paths — permission scope enforcement, memory-limit termination, and manifest validation — carry an explicit "must not regress" gate: a failing test in this category blocks release regardless of overall coverage numbers.`,
      ]),
      sec("2", "Coverage Targets", 1, [
        `command-dispatcher and config-resolver, being the highest-fan-in modules, target 90%+ statement coverage. plugin-loader's sandbox-boundary logic specifically targets 100% branch coverage on permission checks, since a missed branch there is a security gap rather than an ordinary bug.`,
      ]),
      sec("3", "Release Gate", 1, [
        `A release candidate must pass the full integration suite against at least one fixture plugin per declared permission scope, plus the end-to-end smoke suite against a staging analytics backend, before promotion to the Homebrew tap and internal package manager.`,
      ]),
    ],
  },
  {
    key: "testcases",
    icon: "testcases",
    title: "Test cases",
    description: "Concrete test case specifications derived from the test plan, with inputs, steps, and expected results.",
    readMinutes: 11,
    sections: [
      sec("1", "Dispatch and Config Cases", 1, [
        `TC-DISP-018: Unknown command falls back to a fuzzy-match suggestion. Input: \`devcli deloy:rollback\` (typo). Expected: exits non-zero with "Unknown command 'deloy:rollback' — did you mean 'deploy:rollback'?" and no partial execution occurs.`,
        `TC-DISP-022: Invoking a Deprecated command executes normally but warns. Input: a command whose registry entry has \`status: "Deprecated"\`. Expected: stderr contains exactly one deprecation line naming the replacement; stdout is unaffected; exit code reflects the command's own result, not the deprecation.`,
        `TC-CFG-004: Flag overrides environment, project, and global config for the same key. Input: global config sets \`region=us-east-1\`, project config sets \`region=us-west-2\`, env sets \`DEVCLI_REGION=eu-west-1\`, flag passes \`--region ap-south-1\`. Expected: resolved value is \`ap-south-1\`.`,
      ]),
      sec("2", "Plugin Sandbox Cases", 1, [
        `TC-PLUG-006: Plugin exceeding its sandboxed memory limit is terminated and logged. Input: fixture plugin that allocates past its manifest-declared 128MB default. Expected: plugin-loader terminates the WASM instance, surfaces a memory-limit error to the invoking user, and telemetry-emitter records the termination event.`,
        `TC-PLUG-009: Plugin attempting a host call outside its declared permission scope is denied. Input: fixture plugin manifest declares only \`fs:project-root\`, handler calls \`requestPermission(PermissionScope::NetworkRead)\` then attempts a network call anyway. Expected: the network host-function call returns a permission-denied \`CliError\` without crashing the host process.`,
      ]),
      sec("3", "Auth and Telemetry Cases", 1, [
        `TC-AUTH-011: Rotating a service account key immediately revokes the previous key. Input: \`auth:rotate-keys\` followed by a request using the pre-rotation token. Expected: the pre-rotation token is rejected by the auth backend within the same test run, with no grace-period overlap.`,
        `TC-TEL-002: Telemetry flush retries with backoff on a transient network failure and does not drop events. Input: simulated network failure on the first two flush attempts. Expected: events remain in the local spool file until a flush succeeds; no event is silently discarded.`,
      ]),
    ],
  },
  {
    key: "dataflow",
    icon: "dataflow",
    title: "Data flow",
    description: "Data movement across services, stores, and integrations.",
    readMinutes: 7,
    sections: [
      sec("1", "Primary Invocation Path", 1, [
        `A CLI invocation is parsed and routed by command-dispatcher to either a core command handler or, for a plugin-registered command, into plugin-loader's sandboxed execution path. Before the handler runs, config-resolver merges the four configuration layers into an effective config object passed into the handler's execution context.`,
        `If the command requires an authenticated backend call, auth-session-manager supplies a cached short-lived token or mints a new one via the identity provider if the cached token is expired or absent. On completion, telemetry-emitter records the invocation (command path, duration, exit code, anonymized invoker ID — never raw arguments, which may contain secrets) into its in-memory batch buffer.`,
      ]),
      sec("2", "Telemetry Egress", 1, [
        `Every 30 seconds, or at 200 buffered events, telemetry-emitter flushes the batch as an async POST to the internal analytics pipeline. On failure, events are written to a local spool file and retried with exponential backoff on the next flush cycle, so a temporary network partition does not silently lose usage data feeding the adoption dashboards.`,
      ]),
    ],
  },
  {
    key: "traceability",
    icon: "traceability",
    title: "Traceability matrix",
    description: "Mapping from requirements to design, code, and tests.",
    readMinutes: 8,
    sections: [
      sec("1", "Coverage Mapping", 1, [
        `REQ-01 (unify operations behind one command surface) → command-dispatcher, CommandRegistry → TC-DISP-018. REQ-02 (plugin sandbox isolation) → plugin-loader, host-function ABI → TC-PLUG-006, TC-PLUG-009. REQ-03 (deterministic config precedence) → config-resolver, ConfigLayer → TC-CFG-004.`,
        `REQ-04 (observable usage without capturing secrets) → telemetry-emitter → TC-TEL-002. REQ-05 (formal deprecation lifecycle) → CommandRegistry's status field, deprecation-warning path in the Feature Specification → TC-DISP-022. Auth token lifecycle, though not tied to a numbered BRD requirement, is covered by auth-session-manager → TC-AUTH-011.`,
      ]),
    ],
  },
  {
    key: "coverage",
    icon: "coverage",
    title: "Coverage",
    description: "Documentation and code coverage across the codebase.",
    readMinutes: 6,
    sections: [
      sec("1", "Statement and Branch Coverage by Module", 1, [
        `command-dispatcher: 94% statement coverage. config-resolver: 91% statement coverage. plugin-loader: 87% statement coverage overall, 100% branch coverage on the permission-check paths specifically (the release-gated subset). telemetry-emitter: 96% statement coverage. auth-session-manager: 89% statement coverage. Aggregate across the core binary: approximately 91%.`,
      ]),
      sec("2", "Known Gaps", 1, [
        `Coverage is lightest around plugin-loader's WASM-runtime error-translation paths for exotic host-runtime failures (e.g. out-of-memory during instantiation rather than during execution) — flagged for follow-up in the next test-plan revision rather than blocking on it, since these paths are defensive rather than primary.`,
      ]),
    ],
  },
  {
    key: "summary",
    icon: "summary",
    title: "Generation summary",
    description: "Summarizes what is covered across all related documents in a single consolidated view.",
    readMinutes: 5,
    sections: [
      sec("1", "What Was Generated", 1, [
        `This pass produced 14 documents covering the command-dispatcher / config-resolver / plugin-loader / auth-session-manager / telemetry-emitter architecture, business and product requirements grounded in the org's ~2,400-developer, ~312,000-invocation-per-week adoption, the full Plugin SDK host-function interface, a security-focused test plan and test case set, and a getting-started tutorial — all derived from static analysis of the \`internal-cli-toolkit\` repository (54 KLOC core binary).`,
        `The live preview environment associated with this documentation set seeds 20 representative core commands and 15 flagship plugins drawn from the full production catalog of 68 commands and 43 verified or community plugins, for demonstration purposes.`,
      ]),
    ],
  },
  {
    key: "provenance",
    icon: "provenance",
    title: "Provenance",
    description: "Track the origin of data and outputs from start to finish, with complete visibility into how each document was generated.",
    readMinutes: 6,
    sections: [
      sec("1", "Generation Trail", 1, [
        `Source repository: \`github.com/codesingularity/internal-cli-toolkit\`, primary language Rust, 54 KLOC in the core binary across roughly 60 files under \`src/\`. Analysis walked the \`commands/\` directory convention to enumerate the registry-backing macro invocations, the \`plugin-sdk/\` crate for the host-function ABI, and \`config/\` for the four-layer resolution logic.`,
        `Every design claim in the High-Level and Low-Level Design documents traces to a specific module under \`src/dispatcher/\`, \`src/config/\`, \`src/plugin/\`, \`src/auth/\`, or \`src/telemetry/\`; quantitative figures (invocation volume, developer count, onboarding-time reduction) are sourced from the adoption metrics referenced in the project's own retro documentation rather than inferred from code alone.`,
      ]),
    ],
  },
  {
    key: "tutorial",
    icon: "tutorial",
    title: "Tutorial",
    description: "A getting-started walkthrough for running, configuring, and extending the application locally.",
    readMinutes: 8,
    sections: [
      sec("1", "Getting Started", 1, [
        `Clone the repository and build the release binary: \`git clone https://github.com/codesingularity/internal-cli-toolkit && cd internal-cli-toolkit && cargo build --release\`. The resulting binary is at \`./target/release/devcli\`; run \`./target/release/devcli --help\` to confirm the build and see the full command catalog grouped by category.`,
        `Local development config lives at \`~/.config/devcli/config.toml\` (global layer) and an optional \`.devcli.toml\` at your project root (project layer) — remember precedence is flag > env > project > global, so a stray exported \`DEVCLI_REGION\` in your shell profile will silently override your project config, which is the most common first-week confusion this tool produces.`,
      ]),
      sec("2", "Scaffolding a New Plugin", 1, [
        `Run \`devcli plugin scaffold my-plugin\` to generate a plugin crate skeleton with a \`plugin.toml\` manifest and a stub handler implementing \`registerCommand\`. Declare the permission scopes your plugin actually needs in the manifest — requesting a scope you don't use will be flagged in review, and requesting too few will surface as a \`requestPermission\` denial at runtime rather than a build-time error.`,
        `Build the plugin to WASM with the provided \`cargo devcli-plugin build\` alias, then run it locally against a sandboxed config with \`devcli --plugin-dir ./my-plugin/target plugin-command-name\` to test the sandbox boundary behaves as expected before publishing to the internal plugin registry.`,
      ]),
      sec("3", "Making a Change to the Core Binary", 1, [
        `Locate the relevant module using the High-Level Design's module map (command-dispatcher, config-resolver, plugin-loader, auth-session-manager, or telemetry-emitter), add or update the corresponding unit and, if security-relevant, integration test, and verify the affected suite passes locally with \`cargo test\` before opening a pull request. Changes touching plugin-loader's permission-check paths require Security Engineering review per the release gate described in the Test Plan.`,
      ]),
    ],
  },
];

export const internalCliToolkitDocs: DocumentGalleryData = {
  repoUrl: "https://github.com/codesingularity/internal-cli-toolkit",
  repoName: "INTERNALCLITOOLKIT",
  processSteps: [
    { label: "Cloning repository", description: "Fetching source code from remote" },
    { label: "Parsing codebase", description: "Reading and analyzing file structure" },
    { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
    { label: "Extracting architecture", description: "Identifying patterns and system design" },
    { label: "Generating documentation", description: "Writing structured docs from analysis" },
  ],
  events: [
    "Cloned repository — 60 files across the core binary, 54 KLOC",
    "Parsed Cargo workspace structure and build configuration",
    "Built module dependency graph across dispatcher, config, plugin, auth, and telemetry crates",
    "Extracted command-registry macro convention and category taxonomy",
    "Extracted plugin-loader WASM sandbox boundary and host-function ABI",
    "Generated Business Requirements from adoption and onboarding-metrics references",
    "Generated Product Requirements — 5 user stories with acceptance criteria",
    "Generated High-Level Design",
    "Generated Data Flow Diagram — invocation path and telemetry egress",
    "Generated Low-Level Design across 5 core modules",
    "Generated Plugin SDK Reference — 8 host-function signatures",
    "Generated Test Plan, Test Cases, Traceability Matrix, and Coverage report",
    "Generated Tutorial and Provenance record",
  ],
  documents,
};
