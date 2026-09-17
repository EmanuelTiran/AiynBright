import { notFound } from "next/navigation";
import Field from "@/components/Field";
import GuestProductPreview from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";
import { parseFieldDetail } from "@/server/validation/route-params";

export default async function FieldDetailPage({
  params,
}) {
  const { detail } = await params;
  const distanceUser =
    parseFieldDetail(detail);

  if (!distanceUser) {
    notFound();
  }

  const user = await getCurrentUserDTO();

  if (!user) {
    return <GuestProductPreview product="field" training />;
  }

  return (
    <Field
      user={user}
      distanceUser={distanceUser}
    />
  );
}
