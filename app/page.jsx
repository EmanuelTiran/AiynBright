import Link from "next/link";
import CurrentTime from "@/components/CurrentTime";
import ImageCarousel from "@/components/ImageCarousel";
import SighnIn from "@/components/SighnIn";
import VisionImprovementHub from "@/components/VisionImprovementHub";

import {
  authAction,
  logoutAction,
} from "@/server/BL/actions/login.action";

export default async function HomePage() {
  const authData = await authAction();

  return (
    <main>
      <ImageCarousel>
        <VisionImprovementHub />
      </ImageCarousel>

      {authData ? (
        <section className="mx-auto my-10 max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome back
          </h2>

          <p className="mt-2 text-slate-600">
            Continue to your personal
            vision-test history.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/user"
              className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-700"
            >
              My profile
            </Link>

            {authData.isManager && (
              <Link
                href="/admin"
                className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
              >
                Admin
              </Link>
            )}

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </section>
      ) : (
        <SighnIn />
      )}

      <CurrentTime />
    </main>
  );
}