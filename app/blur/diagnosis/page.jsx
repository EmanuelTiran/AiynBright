import RandomCharacterGame from "@/components/RandomCharacterGame";
import GuestProductPreview from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Blur screening",
};

export default async function BlurDiagnosisPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <GuestProductPreview product="blur" />;
  }

  return (
    <RandomCharacterGame user={user} />
  );
}
