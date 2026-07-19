import Link from "next/link";

export default function ToLogin() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Authentication required
        </h1>

        <p className="mt-3 text-slate-600">
          Please sign in or create an account before accessing this page.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-slate-800 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-700"
          >
            Sign in
          </Link>

          <Link
            href="/signin"
            className="rounded-lg bg-amber-500 px-5 py-2.5 font-semibold text-white transition hover:bg-amber-600"
          >
            Create an account
          </Link>
        </div>
      </section>
    </main>
  );
}