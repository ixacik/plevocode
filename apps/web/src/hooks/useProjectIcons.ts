import * as Schema from "effect/Schema";
import { useLocalStorage } from "./useLocalStorage";
import type { ProjectId } from "@t3tools/contracts";
import { useCallback } from "react";

/**
 * Per-project icon override.
 * - `lucide`: one of the curated lucide icon names
 * - `custom`: a data-URL (base64-encoded 128×128 image uploaded by the user)
 */
export type ProjectIconOverride =
  | { readonly type: "lucide"; readonly name: string }
  | { readonly type: "custom"; readonly dataUrl: string };

/** Schema for a single icon override entry. */
const ProjectIconOverrideSchema = Schema.Union([
  Schema.Struct({
    type: Schema.Literal("lucide"),
    name: Schema.String,
  }),
  Schema.Struct({
    type: Schema.Literal("custom"),
    dataUrl: Schema.String,
  }),
]);

/** Schema for the full map: projectId → override. */
const ProjectIconOverridesSchema = Schema.Record(Schema.String, ProjectIconOverrideSchema);

type ProjectIconOverrides = typeof ProjectIconOverridesSchema.Type;

const STORAGE_KEY = "t3code:project-icon-overrides:v1";
const DEFAULT_OVERRIDES: ProjectIconOverrides = {};

export function useProjectIcons() {
  const [overrides, setOverrides] = useLocalStorage(
    STORAGE_KEY,
    DEFAULT_OVERRIDES,
    ProjectIconOverridesSchema,
  );

  const getIconOverride = useCallback(
    (projectId: ProjectId): ProjectIconOverride | null => {
      return (overrides[projectId as string] as ProjectIconOverride | undefined) ?? null;
    },
    [overrides],
  );

  const setIconOverride = useCallback(
    (projectId: ProjectId, override: ProjectIconOverride | null) => {
      setOverrides((prev) => {
        const next = { ...prev };
        if (override === null) {
          delete next[projectId as string];
        } else {
          next[projectId as string] = override;
        }
        return next;
      });
    },
    [setOverrides],
  );

  return { getIconOverride, setIconOverride };
}
