import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import { User } from "next-auth";

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials == undefined) return null;
        const res = await fetch(process.env.BACKEND_BASE_URL + "/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials.username,
            password: credentials.password,
          }),
        });
        const user: User = await res.json();
        if (res.ok) {
          // If status code 200 returned
          console.log("Response OK:", user);
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          console.log("Response NOT OK:", user);
          return {
            access_token: "",
            token_type: "error",
            username: "",
            id: "",
          };
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/credentials/sign-in", // Custom sign in page
  },
  callbacks: {
    async signIn({ user }) {
      console.log(user);
      if (user.token_type == "error") {
        throw new Error("Custom Sign In Error");
      }
      return true;
    },
    async jwt({ token, user }) {
      /**
       * param: token of JWT type
       * param: user of User type returned in `authorize` function
       * return: JWT type (eventually)
       */
      return { ...token, ...user };
    },
    async session({ session, token }) {
      /**
       * param: session of Session type
       * param: token of JWT type
       * return: Session type (eventually)
       */
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to the home page after sign-in
      return url.startsWith(baseUrl) ? baseUrl : url;
    },
  },
});

export { handler as GET, handler as POST };
