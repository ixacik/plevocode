import {
  AppWindowIcon,
  BellIcon,
  BlocksIcon,
  BookIcon,
  BookOpenIcon,
  BoxIcon,
  BrainIcon,
  BriefcaseIcon,
  BugIcon,
  CableIcon,
  CameraIcon,
  CloudIcon,
  CodeIcon,
  CogIcon,
  CommandIcon,
  ComponentIcon,
  CpuIcon,
  DatabaseIcon,
  FlagIcon,
  FlameIcon,
  FolderIcon,
  GamepadIcon,
  GaugeIcon,
  GemIcon,
  GithubIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartIcon,
  HexagonIcon,
  HomeIcon,
  KeyIcon,
  LayersIcon,
  LayoutGridIcon,
  LibraryIcon,
  LightbulbIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  MapIcon,
  MessageSquareIcon,
  MicIcon,
  MonitorIcon,
  MoonIcon,
  MusicIcon,
  PackageIcon,
  PaintbrushIcon,
  PaletteIcon,
  PenToolIcon,
  PhoneIcon,
  PieChartIcon,
  PlugIcon,
  PocketIcon,
  RadioIcon,
  RocketIcon,
  ScrollIcon,
  ServerIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SmartphoneIcon,
  SparklesIcon,
  StarIcon,
  SunIcon,
  TerminalIcon,
  TestTubeIcon,
  TreesIcon,
  TrophyIcon,
  UploadIcon,
  UserIcon,
  VideoIcon,
  WandIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import type { ProjectIconOverride } from "~/hooks/useProjectIcons";
import { Popover, PopoverPopup, PopoverTrigger } from "./ui/popover";
import { cn } from "~/lib/utils";

/**
 * Curated set of icons a user can pick from, grouped by category.
 */
const ICON_CATEGORIES: Array<{ label: string; icons: Array<{ name: string; Icon: LucideIcon }> }> =
  [
    {
      label: "Development",
      icons: [
        { name: "code", Icon: CodeIcon },
        { name: "terminal", Icon: TerminalIcon },
        { name: "bug", Icon: BugIcon },
        { name: "test-tube", Icon: TestTubeIcon },
        { name: "cpu", Icon: CpuIcon },
        { name: "database", Icon: DatabaseIcon },
        { name: "server", Icon: ServerIcon },
        { name: "globe", Icon: GlobeIcon },
        { name: "cable", Icon: CableIcon },
        { name: "plug", Icon: PlugIcon },
        { name: "blocks", Icon: BlocksIcon },
        { name: "component", Icon: ComponentIcon },
        { name: "app-window", Icon: AppWindowIcon },
        { name: "github", Icon: GithubIcon },
        { name: "command", Icon: CommandIcon },
        { name: "layers", Icon: LayersIcon },
      ],
    },
    {
      label: "General",
      icons: [
        { name: "folder", Icon: FolderIcon },
        { name: "home", Icon: HomeIcon },
        { name: "star", Icon: StarIcon },
        { name: "heart", Icon: HeartIcon },
        { name: "zap", Icon: ZapIcon },
        { name: "rocket", Icon: RocketIcon },
        { name: "sparkles", Icon: SparklesIcon },
        { name: "flame", Icon: FlameIcon },
        { name: "gem", Icon: GemIcon },
        { name: "trophy", Icon: TrophyIcon },
        { name: "flag", Icon: FlagIcon },
        { name: "lightbulb", Icon: LightbulbIcon },
        { name: "wand", Icon: WandIcon },
        { name: "brain", Icon: BrainIcon },
        { name: "shield", Icon: ShieldIcon },
        { name: "key", Icon: KeyIcon },
      ],
    },
    {
      label: "Media & Design",
      icons: [
        { name: "palette", Icon: PaletteIcon },
        { name: "paintbrush", Icon: PaintbrushIcon },
        { name: "pen-tool", Icon: PenToolIcon },
        { name: "camera", Icon: CameraIcon },
        { name: "video", Icon: VideoIcon },
        { name: "music", Icon: MusicIcon },
        { name: "mic", Icon: MicIcon },
        { name: "monitor", Icon: MonitorIcon },
        { name: "smartphone", Icon: SmartphoneIcon },
        { name: "layout-grid", Icon: LayoutGridIcon },
        { name: "pie-chart", Icon: PieChartIcon },
        { name: "gauge", Icon: GaugeIcon },
      ],
    },
    {
      label: "Objects",
      icons: [
        { name: "package", Icon: PackageIcon },
        { name: "box", Icon: BoxIcon },
        { name: "briefcase", Icon: BriefcaseIcon },
        { name: "book", Icon: BookIcon },
        { name: "book-open", Icon: BookOpenIcon },
        { name: "library", Icon: LibraryIcon },
        { name: "graduation-cap", Icon: GraduationCapIcon },
        { name: "scroll", Icon: ScrollIcon },
        { name: "mail", Icon: MailIcon },
        { name: "message-square", Icon: MessageSquareIcon },
        { name: "bell", Icon: BellIcon },
        { name: "shopping-cart", Icon: ShoppingCartIcon },
        { name: "map", Icon: MapIcon },
        { name: "link", Icon: LinkIcon },
        { name: "lock", Icon: LockIcon },
        { name: "wrench", Icon: WrenchIcon },
        { name: "cog", Icon: CogIcon },
        { name: "hexagon", Icon: HexagonIcon },
        { name: "pocket", Icon: PocketIcon },
        { name: "radio", Icon: RadioIcon },
        { name: "phone", Icon: PhoneIcon },
        { name: "user", Icon: UserIcon },
        { name: "sun", Icon: SunIcon },
        { name: "moon", Icon: MoonIcon },
        { name: "cloud", Icon: CloudIcon },
        { name: "trees", Icon: TreesIcon },
        { name: "gamepad", Icon: GamepadIcon },
      ],
    },
  ];

/** Flat lookup for resolving a lucide icon by name. */
const ICON_BY_NAME = new Map<string, LucideIcon>(
  ICON_CATEGORIES.flatMap((c) => c.icons.map((i) => [i.name, i.Icon] as const)),
);

/** Resolve a lucide icon component by name, falling back to FolderIcon. */
export function resolveLucideIcon(name: string): LucideIcon {
  return ICON_BY_NAME.get(name) ?? FolderIcon;
}

// ---------------------------------------------------------------------------

interface ProjectIconPickerProps {
  currentOverride: ProjectIconOverride | null;
  onSelect: (override: ProjectIconOverride | null) => void;
  children: React.ReactNode;
}

export const ProjectIconPicker = memo(function ProjectIconPicker({
  currentOverride,
  onSelect,
  children,
}: ProjectIconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = useCallback(
    (override: ProjectIconOverride | null) => {
      onSelect(override);
      setOpen(false);
      setSearch("");
    },
    [onSelect],
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", (readEvent) => {
        const img = new Image();
        img.addEventListener("load", () => {
          // Resize to 128×128 using canvas
          const canvas = document.createElement("canvas");
          canvas.width = 128;
          canvas.height = 128;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0, 128, 128);
          const dataUrl = canvas.toDataURL("image/png");
          handleSelect({ type: "custom", dataUrl });
        });
        img.src = readEvent.target?.result as string;
      });
      reader.readAsDataURL(file);

      // Reset input so re-uploading same file triggers onChange
      event.target.value = "";
    },
    [handleSelect],
  );

  const filteredCategories = search.trim()
    ? ICON_CATEGORIES.map((cat) => ({
        ...cat,
        icons: cat.icons.filter((icon) => icon.name.includes(search.trim().toLowerCase())),
      })).filter((cat) => cat.icons.length > 0)
    : ICON_CATEGORIES;

  const isSelected = (name: string) =>
    currentOverride?.type === "lucide" && currentOverride.name === name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          />
        }
        className="inline-flex shrink-0"
      >
        {children}
      </PopoverTrigger>
      <PopoverPopup side="right" align="start" sideOffset={8} className="w-[280px]">
        <div className="-mx-4 -my-4 flex flex-col">
          {/* Search */}
          <div className="border-b border-border px-3 py-2">
            <input
              type="text"
              placeholder="Search icons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-ring"
              autoFocus
            />
          </div>

          {/* Icon grid */}
          <div className="max-h-[320px] overflow-y-auto px-3 py-2">
            {/* Reset to auto-detected / default */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(null);
              }}
              className={cn(
                "mb-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground",
                currentOverride === null && "bg-accent text-accent-foreground",
              )}
            >
              <FolderIcon className="size-4 shrink-0" fill="currentColor" />
              <span>Auto-detect (default)</span>
            </button>

            {/* Upload custom */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className={cn(
                "mb-3 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent hover:text-accent-foreground",
                currentOverride?.type === "custom" && "bg-accent text-accent-foreground",
              )}
            >
              <UploadIcon className="size-4 shrink-0" />
              <span>Upload custom icon</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Categorised icon grids */}
            {filteredCategories.map((category) => (
              <div key={category.label} className="mb-3">
                <div className="mb-1.5 px-0.5 text-[10px] font-medium tracking-wide text-muted-foreground/60 uppercase">
                  {category.label}
                </div>
                <div className="grid grid-cols-8 gap-0.5">
                  {category.icons.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect({ type: "lucide", name });
                      }}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                        isSelected(name) && "bg-accent text-accent-foreground ring-1 ring-ring",
                      )}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground/60">
                No icons match "{search}"
              </div>
            )}
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  );
});
