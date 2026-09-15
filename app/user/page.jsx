import DetailUser from "@/components/DetailUser";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";

export default async function Page() {
  const user = await getCurrentUserDTO();
  if (!user) return <ToLogin />;
  return <DetailUser simplifiedUser={user} />;
}
