// types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  interface User {
    user: {
      id?: string;
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      companyName?: string;
      accountType?: string;
    };
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string;
      companyName: string;
      accountType: string;
    }
  }
}

interface JWT {
  id?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  accountType?: string;
}
