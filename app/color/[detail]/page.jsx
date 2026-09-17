import { notFound } from "next/navigation";
import ColorChanger from "@/components/Color";
import GuestProductPreview from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";
import { parseColorDetail } from "@/server/validation/route-params";

export default async function ColorDetailPage({
  params,
}) {
  const { detail } = await params;

  const colorsUser =
    parseColorDetail(detail);

  if (!colorsUser) {
    notFound();
  }

  const user =
    await getCurrentUserDTO();

  if (!user) {
    return <GuestProductPreview product="color" training />;
  }

  return (
    <ColorChanger
      user={user}
      colorsUser={colorsUser}
    />
  );
}
