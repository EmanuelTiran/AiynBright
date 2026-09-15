import { BlurFrame } from "@/components/Blur/FlowUI";

export default function Loading() {
  return <BlurFrame><p role="status" className="rounded-3xl border border-amber-200 bg-white p-8 text-lg">Getting your Blur experience ready…</p></BlurFrame>;
}
