import RandomCharacterGame from "@/components/RandomCharacterGame";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Blur screening",
};

export default async function BlurDiagnosisPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <ToLogin />;
  }

  return (
    <RandomCharacterGame user={user} />
  );
}
