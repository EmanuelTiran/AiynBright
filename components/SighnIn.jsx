"use client";

import {
  useState,
  useTransition,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signAction } from "@/server/BL/actions/sighnin.action";

export default function SignUp() {
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
        await signAction(formData);

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
              Create an account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Save and follow your
              vision-test results securely.
            </p>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="username"
            >
              Name
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              id="username"
              name="username"
              type="text"
              autoComplete="name"
              minLength={2}
              maxLength={50}
              required
            />
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
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              aria-describedby="password-help"
              required
            />

            <p
              className="mt-1 text-xs text-slate-500"
              id="password-help"
            >
              Use at least 8 characters,
              including a letter and a number.
            </p>
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
              ? "Creating account…"
              : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-600">
            Already registered?{" "}
            <Link
              className="font-semibold text-amber-600 hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}