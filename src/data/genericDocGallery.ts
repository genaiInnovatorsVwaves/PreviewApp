import type { AppData, CatalogCard, DocSection, DocumentGalleryData, GeneratedDocument } from "./types";
import { generateGenericAppData } from "./generic";

function sec(id: string, title: string, level: 1 | 2, paragraphs: string[]): DocSection {
  return { id, title, level, paragraphs };
}

function buildDocuments(card: CatalogCard, clean: string): GeneratedDocument[] {
  const name = card.title;
  const domainNote = `The system was reverse-engineered directly from its source repository. ${clean}`;

  return [
    {
      key: "hld",
      icon: "hld",
      title: "High level design",
      description: "Architecture overview, major modules, and system boundaries.",
      readMinutes: 8,
      sections: [
        sec("1", "Executive Summary", 1, [
          domainNote,
          `The architecture follows a layered approach — presentation, application services, domain logic, and persistence — with cross-cutting concerns such as auth, logging, and configuration centralized rather than duplicated per module.`,
        ]),
        sec("2", "Architecture Overview", 1, [
          `Static analysis of the codebase identified clear module boundaries with an internal API surface consumed across the system, and a smaller external-facing surface exposed to other services.`,
        ]),
        sec("3", "Key Design Decisions", 1, [
          `Interface-driven contracts between layers keep modules loosely coupled; configuration is centralized and environment-specific values are externalized rather than hard-coded.`,
        ]),
      ],
    },
    {
      key: "lld",
      icon: "lld",
      title: "Low level design",
      description: "Detailed components, interfaces, and implementation structure.",
      readMinutes: 10,
      sections: [
        sec("1", "Module Breakdown", 1, [
          `Each core module exposes a narrow public interface backed by an internal implementation package, so callers depend on contracts rather than concrete classes.`,
        ]),
        sec("2", "Data Access Layer", 1, [
          `Persistence is centralized behind a repository layer, with query logic isolated from business logic to keep the two independently testable.`,
        ]),
        sec("3", "Error Handling", 1, [
          `Errors are normalized to a small set of typed exceptions at the module boundary, translated to the appropriate transport-layer response by a shared handler.`,
        ]),
      ],
    },
    {
      key: "brd",
      icon: "brd",
      title: "Business requirements",
      description: "Business goals, stakeholders, and functional requirements.",
      readMinutes: 7,
      sections: [
        sec("1", "Business Goals", 1, [`${clean} This addresses a real operational gap: the workflow it automates was previously manual, inconsistent, or scattered across disconnected tools.`]),
        sec("2", "Stakeholders", 1, [`Primary stakeholders are the operators who use the system day-to-day and the managers who depend on its reporting for decisions.`]),
      ],
    },
    {
      key: "prd",
      icon: "prd",
      title: "Product requirements",
      description: "Product scope, user stories, and acceptance criteria.",
      readMinutes: 9,
      sections: [
        sec("1", "Scope", 1, [`The product scope inferred from the codebase covers the core workflow end-to-end, along with the reporting and administrative surfaces needed to operate it.`]),
        sec("2", "User Stories", 1, [`As a primary operator, I need to create, update, and track records through their lifecycle without leaving the system of record.`]),
      ],
    },
    {
      key: "feature",
      icon: "feature",
      title: "Feature specification",
      description: "Feature behavior, inputs, outputs, and edge cases.",
      readMinutes: 11,
      sections: [
        sec("1", "Core Behavior", 1, [`The primary feature set accepts structured input, validates it against the domain's business rules, and persists the result with a full audit trail.`]),
        sec("2", "Edge Cases", 1, [`Partial or malformed input is rejected with a field-level error rather than silently accepted; duplicate submissions are detected and deduplicated where an idempotency key is available.`]),
      ],
    },
    {
      key: "api",
      icon: "api",
      title: "API reference",
      description: "Endpoints, payloads, authentication, and error contracts.",
      readMinutes: 12,
      sections: [
        sec("1", "Authentication", 1, [`All endpoints require a bearer token issued by the platform's identity provider; unauthenticated requests receive a 401 with a standard error envelope.`]),
        sec("2", "Core Endpoints", 1, [`The API exposes CRUD-style endpoints over the system's primary entities, plus a small number of workflow-transition endpoints that enforce the domain's state machine.`]),
      ],
    },
    {
      key: "testplan",
      icon: "testplan",
      title: "Test plan",
      description: "Test scenarios, coverage targets, and validation steps.",
      readMinutes: 9,
      sections: [
        sec("1", "Test Strategy", 1, [`Testing is layered: unit tests around business logic, integration tests around persistence and external calls, and a smaller set of end-to-end tests around the primary user journeys.`]),
        sec("2", "Coverage Targets", 1, [`Core workflow logic targets high statement coverage; peripheral reporting and admin surfaces are covered more lightly, consistent with their lower change frequency.`]),
      ],
    },
    {
      key: "testcases",
      icon: "testcases",
      title: "Test cases",
      description: "Concrete test case specifications derived from the test plan, with inputs, steps, and expected results.",
      readMinutes: 10,
      sections: [
        sec("1", "Happy Path Cases", 1, [`Covers successful creation, update, and transition of a record through every valid state in its lifecycle, verifying persisted state and emitted notifications at each step.`]),
        sec("2", "Negative Cases", 1, [`Covers invalid input, unauthorized access, and illegal state transitions, verifying the system rejects each with the correct error and no partial state change.`]),
      ],
    },
    {
      key: "dataflow",
      icon: "dataflow",
      title: "Data flow",
      description: "Data movement across services, stores, and integrations.",
      readMinutes: 6,
      sections: [
        sec("1", "Primary Data Path", 1, [`Inbound requests are validated at the boundary, transformed into domain objects, persisted, and then fanned out to downstream notification and reporting consumers.`]),
      ],
    },
    {
      key: "traceability",
      icon: "traceability",
      title: "Traceability matrix",
      description: "Mapping from requirements to design, code, and tests.",
      readMinutes: 8,
      sections: [
        sec("1", "Coverage Mapping", 1, [`Every functional requirement identified during analysis maps to at least one design section and one corresponding test case, closing the loop from intent to verification.`]),
      ],
    },
    {
      key: "coverage",
      icon: "coverage",
      title: "Coverage",
      description: "Documentation and code coverage across the codebase.",
      readMinutes: 5,
      sections: [
        sec("1", "Summary", 1, [`Core modules are fully documented and covered by tests; peripheral utility code has partial documentation coverage, flagged for follow-up.`]),
      ],
    },
    {
      key: "summary",
      icon: "summary",
      title: "Generation summary",
      description: "Summarizes what is covered across all related documents in a single consolidated view.",
      readMinutes: 4,
      sections: [
        sec("1", "What Was Generated", 1, [`This pass produced 14 documents covering architecture, requirements, API surface, test strategy, and a getting-started tutorial, all derived from static analysis of ${name}.`]),
      ],
    },
    {
      key: "provenance",
      icon: "provenance",
      title: "Provenance",
      description: "Track the origin of data and outputs from start to finish, with complete visibility into how each document was generated.",
      readMinutes: 5,
      sections: [
        sec("1", "Generation Trail", 1, [`Every document links back to the repository commit, file paths, and analysis pass that produced it, so any claim in the documentation can be traced back to source.`]),
      ],
    },
    {
      key: "tutorial",
      icon: "tutorial",
      title: "Tutorial",
      description: "A getting-started walkthrough for running, configuring, and extending the application locally.",
      readMinutes: 7,
      sections: [
        sec("1", "Getting Started", 1, [`Clone the repository, install dependencies, and configure the local environment file before starting the application in development mode.`]),
        sec("2", "Making a Change", 1, [`Locate the relevant module using the High-Level Design's module map, add or update tests alongside the change, and verify the affected test suite passes locally before opening a pull request.`]),
      ],
    },
  ];
}

export function generateDocGalleryAppData(card: CatalogCard): AppData {
  const base = generateGenericAppData(card);
  const clean = card.description.replace(/\*\*/g, "");
  const repoSlug = card.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const repoUrl = `https://github.com/codesingularity/${repoSlug}`;

  const gallery: DocumentGalleryData = {
    repoUrl,
    repoName: card.title.toUpperCase().replace(/[^A-Z0-9]/g, ""),
    processSteps: [
      { label: "Cloning repository", description: "Fetching source code from remote" },
      { label: "Parsing codebase", description: "Reading and analyzing file structure" },
      { label: "Building dependency graph", description: "Mapping relationships and dependencies" },
      { label: "Extracting architecture", description: "Identifying patterns and system design" },
      { label: "Generating documentation", description: "Writing structured docs from analysis" },
    ],
    events: [
      "Cloned repository and analyzed the source tree",
      "Parsed project structure and build configuration",
      "Built module dependency graph",
      "Extracted layered architecture and API surface",
      "Generated Business Requirements",
      "Generated Product Requirements",
      "Generated High-Level Design",
      "Generated Data Flow Diagram",
      "Generated Low-Level Design across core modules",
      "Generated API Reference, Test Plan, and Test Cases",
      "Generated Traceability Matrix and Coverage report",
      "Generated Tutorial and Provenance record",
    ],
    documents: buildDocuments(card, clean),
  };

  return {
    ...base,
    chat: [
      { role: "user", text: `Import ${repoUrl} and generate full documentation.` },
      {
        role: "ai",
        text: `Cloning the repository now — I'll parse the codebase, build the module dependency graph, and extract the architecture before generating docs.`,
      },
      { role: "ai", text: clean },
      {
        role: "ai",
        text: `Generated 14 documents — High-Level Design, Low-Level Design, Business Requirements, Product Requirements, Feature Specification, API Reference, Test Plan, Test Cases, Data Flow, Traceability Matrix, Coverage, Generation Summary, Provenance, and a Tutorial.`,
      },
    ],
    documentGallery: gallery,
  };
}
