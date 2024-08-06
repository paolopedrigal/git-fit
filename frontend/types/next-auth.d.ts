// next-auth typescript declaration file
import NextAuth from "next-auth";

// Declaration merging with "next-auth" module
declare module "next-auth" {
  interface Session {
    user: {
      access_token: string;
      token_type: string;
      id: string | number;
      username: string;
    };
  }
  interface User {
    access_token: string;
    token_type: string;
    id: string | number;
    username: string;
  }
}

// Declaration merging with "next-auth/jwt" sub-module
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    token_type: string;
    id: string | number;
    username: string;
  }
}
