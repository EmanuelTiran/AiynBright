import Blur from "@/components/Blur";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Blur exercise",
};

export default async function BlurImprovementPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <ToLogin />;
  }

  return <Blur user={user} />;
}