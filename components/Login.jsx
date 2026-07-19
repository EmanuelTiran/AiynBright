"use client";

import {
  useState,
  useTransition,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/server/BL/actions/login.action";

export default function Login() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isPending, startTransition] =
    useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const formData = new FormData(
      event.currentTarget,
    );

    startTransition(async () => {
      const result =
        await loginAction(formData);

      if (!result.success) {
        setMessage(result.message);
        return;
      }

      router.replace("/user");
      router.refresh();
    });
  }

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-4">
      <form
        className="w-full max-w-md"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="space-y-5 rounded-xl bg-white px-8 py-7 shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to view your
              vision-test history.
            </p>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="email"
            >
              Email address
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              required
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="password"
            >
              Password
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={128}
              required
            />
          </div>

          {message && (
            <p
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {message}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-slate-800 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isPending}
          >
            {isPending
              ? "Signing in…"
              : "Sign in"}
          </button>

          <p className="text-center text-sm text-slate-600">
            No account yet?{" "}
            <Link
              className="font-semibold text-amber-600 hover:underline"
              href="/signin"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}