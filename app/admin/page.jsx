import ArrUsers from "@/components/ArrUsers";
import { connectToMongo } from "@/server/connectToMongo";
import { readUsersService } from "@/server/BL/services/user.service";

import {
  getAdminSession,
  toSafeUserDTO,
} from "@/server/data/current-user";

export const metadata = {
  title: "ניהול משתמשים",
};

function AccessDenied() {
  return (
    <main
      dir="rtl"
      className="flex min-h-[60vh] items-center justify-center bg-slate-950 p-6"
    >
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">
          הגישה נדחתה
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          נדרשת הרשאת מנהל כדי לצפות בעמוד הזה.
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
