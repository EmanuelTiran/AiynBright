import Field from "@/components/Field";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Visual-field screening",
};

export default async function FieldPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <ToLogin />;
  }

  return <Field user={user} />;
}