import Link from "next/link";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Blur vision",
};

function OptionLink({ href, children }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-300 to-amber-500 px-4 py-3 font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:from-amber-200 hover:to-amber-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
    >
      {children}
    </Link>
  );
}

export default async function BlurPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <ToLogin />;
  }

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-100 p-4">
      <section className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Blur vision
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Start a screening exercise or
            continue from a previous result.
          </p>
        </div>

        {user.sizeWeaknesses.length > 0 && (
          <OptionLink href="/blur/improve">
            Continue exercise
          </OptionLink>
        )}

        <OptionLink href="/blur/diagnosis">
          Start screening
        </OptionLink>

        <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          AyinBright is an educational
          screening tool, not a medical
          diagnosis. Consult a qualified
          eye-care professional about symptoms
          or changes in vision.
        </p>
      </section>
    </main>
  );
}