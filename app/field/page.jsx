import Field from "@/components/Field";
import GuestProductPreview from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Visual-field screening",
};

export default async function FieldPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <GuestProductPreview product="field" />;
  }

  return <Field user={user} />;
}
