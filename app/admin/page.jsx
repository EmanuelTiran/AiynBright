import ArrUsers from "@/components/ArrUsers";
import { connectToMongo } from "@/server/connectToMongo";
import { readUsersService } from "@/server/BL/services/user.service";

import {
  getAdminSession,
  toSafeUserDTO,
} from "@/server/data/current-user";

export const metadata = {
  title: "Administration",
};

function AccessDenied() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800">
          Access denied
        </h1>

        <p className="mt-2 text-slate-600">
          Administrator permission is
          required to view this page.
        </p>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    return <AccessDenied />;
  }

  await connectToMongo();

  const users = await readUsersService({});
  const safeUsers = users.map(toSafeUserDTO);

  return <ArrUsers users={safeUsers} />;
}