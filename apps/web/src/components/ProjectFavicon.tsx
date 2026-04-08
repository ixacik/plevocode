import { FolderIcon } from "lucide-react";
import { memo, useState } from "react";
import { resolveServerUrl } from "~/lib/utils";
import type { ProjectIconOverride } from "~/hooks/useProjectIcons";
import { resolveLucideIcon } from "./ProjectIconPicker";
import { cn } from "~/lib/utils";

const loadedProjectFaviconSrcs = new Set<string>();

interface ProjectFaviconProps {
  cwd: string;
  className?: string;
  /** When provided, renders the override icon instead of auto-detecting. */
  iconOverride?: ProjectIconOverride | null;
  /** When true, adds interactive hover styling (like toolbar buttons). */
  interactive?: boolean;
}

export const ProjectFavicon = memo(function ProjectFavicon({
  cwd,
  className,
  iconOverride,
  interactive,
}: ProjectFaviconProps) {
  const src = resolveServerUrl({
    protocol: "http",
    pathname: "/api/project-favicon",
    searchParams: { cwd },
  });
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(() =>
    loadedProjectFaviconSrcs.has(src) ? "loaded" : "loading",
  );

  const wrapperClass = cn(
    "inline-flex size-5 shrink-0 items-center justify-center rounded-md transition-colors",
    interactive && "hover:bg-accent hover:text-foreground",
    className,
  );

  // Lucide icon override
  if (iconOverride?.type === "lucide") {
    const Icon = resolveLucideIcon(iconOverride.name);
    return (
      <span className={wrapperClass}>
        <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
      </span>
    );
  }

  // Custom uploaded icon override
  if (iconOverride?.type === "custom") {
    return (
      <span className={wrapperClass}>
        <img
          src={iconOverride.dataUrl}
          alt=""
          className="size-3.5 shrink-0 rounded-sm object-contain"
        />
      </span>
    );
  }

  // Auto-detected favicon (default)
  return (
    <span className={wrapperClass}>
      {status !== "loaded" ? (
        <FolderIcon fill="currentColor" className="size-3.5 shrink-0 text-muted-foreground/50" />
      ) : null}
      <img
        src={src}
        alt=""
        className={cn(
          "size-3.5 shrink-0 rounded-sm object-contain",
          status !== "loaded" && "hidden",
        )}
        onLoad={() => {
          loadedProjectFaviconSrcs.add(src);
          setStatus("loaded");
        }}
        onError={() => setStatus("error")}
      />
    </span>
  );
});
