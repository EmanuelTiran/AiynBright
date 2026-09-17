import Blur from "@/components/Blur";
import GuestProductPreview from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Blur exercise",
};

export default async function BlurImprovementPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <GuestProductPreview product="blur" training />;
  }

  return <Blur user={user} />;
}
