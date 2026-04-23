export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4f6fb_0%,_#edf2f8_100%)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden border-r border-white/60 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.18),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(247,249,252,0.96))] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                AF
              </div>
              <div>
                <p className="text-base font-semibold">AgileFlow</p>
                <p className="text-xs text-slate-500">Secure delivery workspace</p>
              </div>
            </div>

            <div className="mt-16 max-w-lg">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
                Authentication
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                Access projects, boards, and reporting from one consistent frontend.
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                This first milestone keeps the auth experience compact and reusable so
                later API integration and MFA steps can be added without redesigning the
                flow.
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              Login, registration, and password reset now share the same route group and
              visual structure.
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
              The existing API service, validation, and store logic remain reusable for
              the next milestone.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
