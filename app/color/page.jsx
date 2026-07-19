import ColorChanger from "@/components/Color";
import ToLogin from "@/components/ToLogin";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Color screening",
};

export default async function ColorPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <ToLogin />;
  }

  return <ColorChanger user={user} />;
}