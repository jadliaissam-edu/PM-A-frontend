import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const pillars = [
  {
    title: "Plan with clarity",
    description:
      "Create roadmaps, break work into delivery streams, and keep stakeholders aligned.",
    icon: Layers3,
  },
  {
    title: "Track execution",
    description:
      "Move from backlog to active delivery with issue views, boards, and team ownership.",
    icon: CheckCircle2,
  },
  {
    title: "Report progress",
    description:
      "Surface sprint health, workload balance, and release readiness without extra busywork.",
    icon: BarChart3,
  },
];

const highlights = [
  "Project spaces for delivery teams",
  "Auth and MFA ready frontend flows",
  "Board, issue, and reporting foundations",
  "API-ready service layer for backend integration",
];

const stats = [
  { label: "Teams", value: "24" },
  { label: "Open issues", value: "186" },
  { label: "Sprint velocity", value: "92%" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)] text-slate-950">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_42%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.2),_transparent_38%),linear-gradient(180deg,_#fffdf8_0%,_#f5f7fb_72%,_#eef3f8_100%)]" />

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            AF
          </div>
          <div>
            <p className="text-base font-semibold">AgileFlow</p>
            <p className="text-xs text-slate-500">Project delivery workspace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#product" className="transition hover:text-slate-950">
            Product
          </a>
          <a href="#workflow" className="transition hover:text-slate-950">
            Workflow
          </a>
          <a href="#reports" className="transition hover:text-slate-950">
            Reports
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Start free
          </Link>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pb-24 lg:pt-14">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur">
            <Sparkles size={16} className="text-amber-500" />
            Graduation project frontend for modern delivery teams
          </div>

          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-6xl">
            Coordinate projects, issues, and sprints in one structured workspace.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            AgileFlow gives product, engineering, and admin teams a shared frontend
            for planning, execution, authentication, and reporting. The structure is
            inspired by proven Jira workflows, but the interface stays clean, calm,
            and original.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Create account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
            >
              View workspace preview
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4 text-sm text-slate-700 shadow-sm backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur">
          <div className="rounded-[1.6rem] border border-slate-200 bg-slate-950 p-5 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-300">Delivery center</p>
                <h2 className="text-xl font-semibold">Platform migration</h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">
                Sprint 08
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.4rem] bg-white p-4 text-slate-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Sprint board snapshot</p>
                  <p className="text-xs text-slate-500">
                    Backlog, active work, review, and done status at a glance
                  </p>
                </div>
                <Clock3 size={18} className="text-slate-400" />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <BoardColumn
                  title="Backlog"
                  tone="bg-amber-50 text-amber-700"
                  items={["Landing page polish", "Issue detail states"]}
                />
                <BoardColumn
                  title="In progress"
                  tone="bg-sky-50 text-sky-700"
                  items={["Auth route cleanup", "Dashboard move"]}
                />
                <BoardColumn
                  title="Done"
                  tone="bg-emerald-50 text-emerald-700"
                  items={["API client setup", "Validation baseline"]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="product"
        className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-16 lg:grid-cols-3 lg:px-8"
      >
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              key={pillar.title}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon size={20} />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {pillar.description}
              </p>
            </article>
          );
        })}
      </section>

      <section
        id="workflow"
        className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-8"
      >
        <div className="rounded-[2rem] border border-slate-200 bg-[#fff7ed] p-8">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-amber-700">
            Workflow
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">
            Keep every role inside one coherent system.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Public pages attract users, auth pages secure access, and workspace views
            handle projects, tickets, boards, reports, and settings without breaking
            the navigation model.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FeatureTile
            icon={<Users size={18} />}
            title="Team workspaces"
            description="Separate views for contributors, project leads, and admins."
          />
          <FeatureTile
            icon={<ShieldCheck size={18} />}
            title="Secure onboarding"
            description="Login, registration, password recovery, and MFA-ready flows."
          />
          <FeatureTile
            icon={<Layers3 size={18} />}
            title="Project structure"
            description="Support backlog, sprint planning, board work, and issue detail."
          />
          <FeatureTile
            icon={<BarChart3 size={18} />}
            title="Report visibility"
            description="Prepare the frontend for productivity and delivery analytics."
          />
        </div>
      </section>

      <section
        id="reports"
        className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-teal-700">
              Ready for integration
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              Frontend architecture prepared for backend growth.
            </h2>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-slate-950"
          >
            Explore authentication
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <InfoCard
            title="React Query provider"
            description="Shared async state foundation is already in place for server data."
          />
          <InfoCard
            title="Zod form validation"
            description="Auth inputs already validate cleanly and can grow with backend rules."
          />
          <InfoCard
            title="Typed service layer"
            description="Axios services and shared types can expand without changing route UX."
          />
        </div>
      </section>
    </main>
  );
}

function BoardColumn({
  title,
  tone,
  items,
}: {
  title: string;
  tone: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
          {items.length} items
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-xl bg-white px-3 py-3 text-sm text-slate-700">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureTile({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}
