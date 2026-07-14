import type { DataDictionaryEntity, DataDictionaryField } from "./types";

type FieldOpts = { modifier?: "PK" | "FK" | "UK"; validation?: string; analytics?: string; description: string };

export function field(name: string, type: DataDictionaryField["type"], opts: FieldOpts): DataDictionaryField {
  return { name, type, modifier: opts.modifier, validation: opts.validation ?? "none", analytics: opts.analytics, description: opts.description };
}

export function auditFields(full = true): DataDictionaryField[] {
  const base = [
    field("CUSTOMER_ID", "Integer", { description: "Tenant/customer scope for multi-tenant isolation" }),
    field("CREATED_TIME", "DateTime", { analytics: "CURRENT_TIMESTAMP", description: "Record creation timestamp" }),
    field("CREATOR", "Integer", { description: "User who created this record" }),
  ];
  if (!full) return base;
  return [
    base[0],
    base[1],
    field("MODIFIED_TIME", "DateTime", { analytics: "CURRENT_TIMESTAMP", description: "Last update timestamp" }),
    base[2],
    field("LAST_MODIFIER", "Integer", { description: "User who last modified this record" }),
  ];
}

// PLC schema audit-column blocks — CUSTOMER_ID, IS_DELETED, ROW_VERSION, CREATED_TIME,
// MODIFIED_TIME, CREATOR, LAST_MODIFIER on business tables; junction tables omit
// IS_DELETED/ROW_VERSION since they are hard-deleted via ON DELETE CASCADE.
export function plcBusinessAuditFields(): DataDictionaryField[] {
  return [
    field("CUSTOMER_ID", "Integer", { validation: "required", description: "Tenant isolation key. Every query must filter on this column. No FK by pipeline rule." }),
    field("IS_DELETED", "Boolean", { validation: "default: false", description: "Soft-delete flag. Application queries must filter IS_DELETED = 0." }),
    field("ROW_VERSION", "Integer", { validation: "default: 1", description: "Optimistic-locking counter, incremented by the application on every UPDATE." }),
    field("CREATED_TIME", "DateTime", { analytics: "CURRENT_TIMESTAMP", validation: "required", description: "System audit: row creation instant, UTC. Engine-maintained." }),
    field("MODIFIED_TIME", "DateTime", { analytics: "CURRENT_TIMESTAMP", validation: "required", description: "System audit: last modification instant, UTC. Engine-maintained." }),
    field("CREATOR", "Reference", { modifier: "FK", validation: "optional, FK → USER.ID, ON DELETE SET NULL", description: "System audit: creating user. NULL if that user was deleted." }),
    field("LAST_MODIFIER", "Reference", { modifier: "FK", validation: "optional, FK → USER.ID, ON DELETE SET NULL", description: "System audit: last-modifying user. NULL if that user was deleted." }),
  ];
}

export function plcJunctionAuditFields(): DataDictionaryField[] {
  return [
    field("CUSTOMER_ID", "Integer", { validation: "required", description: "Tenant isolation key. Denormalised from both parents, which must agree." }),
    field("CREATED_TIME", "DateTime", { analytics: "CURRENT_TIMESTAMP", validation: "required", description: "System audit: row creation instant, UTC. Engine-maintained." }),
    field("MODIFIED_TIME", "DateTime", { analytics: "CURRENT_TIMESTAMP", validation: "required", description: "System audit: last modification instant, UTC. Engine-maintained." }),
    field("CREATOR", "Reference", { modifier: "FK", validation: "optional, FK → USER.ID, ON DELETE SET NULL", description: "System audit: creating user. NULL if that user was deleted." }),
    field("LAST_MODIFIER", "Reference", { modifier: "FK", validation: "optional, FK → USER.ID, ON DELETE SET NULL", description: "System audit: last-modifying user. NULL if that user was deleted." }),
  ];
}

export function lookupTable(name: string, description: string): DataDictionaryEntity {
  return {
    name,
    description,
    fields: [
      field("ID", "Integer", { modifier: "PK", validation: "required, unique", description: "Unique identifier" }),
      field("CODE", "String", { validation: "required, maxLength: 255", description: "Machine-readable code" }),
      field("LABEL", "String", { validation: "required, maxLength: 255", description: "Human-readable display label" }),
      ...auditFields(),
    ],
  };
}
