import { WorkspaceSidebar } from "@/features/workspace/components/workspace-sidebar";
import { WorkspaceTopbar } from "@/features/workspace/components/workspace-topbar";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="flex min-h-screen">
        <WorkspaceSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <WorkspaceTopbar />
          <div className="flex-1 p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
