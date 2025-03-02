import { useSession } from "next-auth/react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  accountType: string;
}

export function useUser() {
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  return {
    user,
    isLoading: !session,
    isAuthenticated: !!session,
  };
} 