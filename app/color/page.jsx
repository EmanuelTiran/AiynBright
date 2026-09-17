import ColorChanger from "@/components/Color";
import GuestProductPreview from "@/components/GuestProductPreview";
import { getCurrentUserDTO } from "@/server/data/current-user";

export const metadata = {
  title: "Color screening",
};

export default async function ColorPage() {
  const user = await getCurrentUserDTO();

  if (!user) {
    return <GuestProductPreview product="color" />;
  }

  return <ColorChanger user={user} />;
}
