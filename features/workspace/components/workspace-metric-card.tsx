interface WorkspaceMetricCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export function WorkspaceMetricCard({
  title,
  value,
  subtitle,
}: WorkspaceMetricCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}
