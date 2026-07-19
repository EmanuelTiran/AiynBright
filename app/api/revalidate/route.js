import { revalidatePath } from "next/cache";

export async function POST(request) {
  const authorization =
    request.headers.get("authorization");

  const expectedSecret =
    process.env.REVALIDATE_SECRET;

  if (
    !expectedSecret ||
    authorization !==
      `Bearer ${expectedSecret}`
  ) {
    return Response.json(
      {
        message: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  let path = "/";

  try {
    const body = await request.json();

    if (
      typeof body?.path === "string" &&
      body.path.startsWith("/")
    ) {
      path = body.path;
    }
  } catch {
    // An empty body revalidates the home page.
  }

  revalidatePath(path);

  return Response.json({
    revalidated: true,
    path,
  });
}