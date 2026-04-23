import { cn } from "@/lib/utils";

interface WorkspaceAvatarStackProps {
  initials: string[];
  size?: "sm" | "md";
}

export function WorkspaceAvatarStack({
  initials,
  size = "sm",
}: WorkspaceAvatarStackProps) {
  const dimension = size === "md" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]";

  return (
    <div className="flex -space-x-2">
      {initials.map((item) => (
        <div
          key={item}
          className={cn(
            "flex items-center justify-center rounded-full border-2 border-white bg-zinc-300 font-semibold text-zinc-700",
            dimension,
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
