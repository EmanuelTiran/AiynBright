import DetailUser from "@/components/DetailUser";
import { GuestUserPreview } from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";

export default async function Page() {
  const user = await getCurrentUserDTO();
  if (!user) return <GuestUserPreview />;
  return <DetailUser simplifiedUser={user} />;
}
