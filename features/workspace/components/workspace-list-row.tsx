import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WorkspaceListRowProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  href?: string;
  className?: string;
}

export function WorkspaceListRow({
  title,
  subtitle,
  trailing,
  href,
  className,
}: WorkspaceListRowProps) {
  const sharedClassName = cn(
    "flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition",
    href ? "hover:bg-zinc-100" : "",
    className,
  );

  const content = (
    <>
      <div>
        <p className="font-medium text-zinc-800">{title}</p>
        {subtitle ? <p className="mt-1 text-xs text-zinc-500">{subtitle}</p> : null}
      </div>
      {trailing}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return <div className={sharedClassName}>{content}</div>;
}
