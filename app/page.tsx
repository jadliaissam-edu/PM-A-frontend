import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <section className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl font-bold text-zinc-900">PM-A Frontend</h1>
        <p className="mt-3 text-zinc-600">
          Frontend connecte au backend Django pour l&apos;authentification et la reinitialisation de mot de passe.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/register"
            className="rounded-lg bg-zinc-900 px-4 py-3 text-center font-medium text-white transition hover:bg-zinc-800"
          >
            Inscription
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-4 py-3 text-center font-medium text-white transition hover:bg-zinc-800"
          >
            Connexion
          </Link>
          <Link
            href="/forgot-password"
            className="rounded-lg border border-zinc-300 px-4 py-3 text-center font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            Demander OTP
          </Link>
          <Link
            href="/reset-password-verify"
            className="rounded-lg border border-zinc-300 px-4 py-3 text-center font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            Verifier OTP
          </Link>
        </div>
      </section>
    </main>
  );
}
