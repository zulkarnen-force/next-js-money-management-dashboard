// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // Redirect to login page if not authenticated
  },
  callbacks: {
    authorized: ({ req, token }) => {
      // Only allow access if a token exists
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!login).*)"], // Protect all routes except /login
};
