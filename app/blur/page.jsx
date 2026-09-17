import Link from "next/link";
import { AccountAction, GuestAccess } from "@/components/GuestAccess";
import { getCurrentUserDTO } from "@/server/data/current-user";
import { BlurFrame, primaryAction, secondaryAction } from "@/components/Blur/FlowUI";

export const metadata = { title: "Blur test" };

export default async function BlurPage() {
  const user = await getCurrentUserDTO();

  return (
    <GuestAccess>
    <BlurFrame stage={0}>
      <section className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-amber-300 to-amber-500 px-6 py-8 sm:px-10 sm:py-10">
          <p className="mb-3 font-semibold">ONE EYE AT A TIME</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">A little clarity.<br />One step at a time.</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed">Match the characters you can see. This Blur screening exercise records a character size for each eye.</p>
        </div>
        <div className="space-y-7 p-6 sm:p-10">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-lg font-semibold">
            <li>About 3–5 minutes</li><li>Both eyes, separately</li><li>1 metre from the screen</li>
          </ul>
          <p className="text-slate-700">We’ll check your screen setup, then guide you through each eye. You can finish after one eye if you need to.</p>
          <AccountAction authenticated={Boolean(user)} href="/blur/diagnosis" className={primaryAction}>Start test <span aria-hidden="true">→</span></AccountAction>
          {!user && (
            <div className="flex flex-wrap gap-4">
              <AccountAction href="/blur/improve" className={secondaryAction}>Begin training</AccountAction>
              <AccountAction href="/user" className={secondaryAction}>View personal progress</AccountAction>
              <a href="/blurRules.txt" target="_blank" rel="noreferrer" className={secondaryAction}>Read instructions (new tab)</a>
            </div>
          )}
          {user?.sizeWeaknesses.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6">
              <p className="w-full font-semibold">Pick up from your previous results</p>
              <Link href="/blur/improve" className={secondaryAction}>Continue training</Link>
              <Link href="/user" className={secondaryAction}>View my results</Link>
            </div>
          )}
          <p className="leading-relaxed text-slate-700">An educational screening exercise, not a medical diagnosis.</p>
        </div>
      </section>
    </BlurFrame>
    </GuestAccess>
  );
}
