import { withAuth } from "next-auth/middleware";

// Protect internal app routes server-side with NextAuth
// Ensure `next-auth` is installed and configured in your app

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // token present => authenticated
      return !!token;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // dashboard temporarily excluded from auth during local debugging
    "/tickets/:path*",
    "/project/:path*",
    "/Board/:path*",
    "/release/:path*",
    "/chat/:path*",
    "/reports/:path*",
  ],
};
