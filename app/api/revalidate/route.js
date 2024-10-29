export async function GET(request) {
    const url = new URL(request.url);
    const secret = url.searchParams.get('secret');  // סוד לאימות הבקשה
  
    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response('Invalid secret', { status: 401 });
    }
  
    try {
      await revalidatePath('/');  // לדוגמה: ריענון עמוד הבית
      return new Response('Revalidated!', { status: 200 });
    } catch (error) {
      return new Response('Error revalidating', { status: 500 });
    }
  }
  