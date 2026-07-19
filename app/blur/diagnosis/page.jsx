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
    <main className="container mx-auto flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <RandomCharacterGame user={user} />
    </main>
  );
}