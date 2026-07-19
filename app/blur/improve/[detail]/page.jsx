import { notFound } from "next/navigation";
import Blur from "@/components/Blur";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";
import { parseBlurDetail } from "@/server/validation/route-params";

export default async function BlurImprovementDetailPage({
  params,
}) {
  const { detail } = await params;
  const sizeUser = parseBlurDetail(detail);

  if (!sizeUser) {
    notFound();
  }

  const user = await getCurrentUserDTO();

  if (!user) {
    return <ToLogin />;
  }

  return (
    <Blur
      user={user}
      sizeUser={sizeUser}
    />
  );
}