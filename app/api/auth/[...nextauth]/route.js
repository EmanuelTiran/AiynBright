// import NextAuth from "next-auth/next";
// import GoogleProvider from "next-auth/providers/google";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   adapter: SupabaseAdapter({
//     url: process.env.SUPABASE_URL,
//     secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
//   }),
// });

// export { handler as GET, handler as POST };