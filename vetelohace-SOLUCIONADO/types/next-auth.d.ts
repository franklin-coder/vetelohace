
import { DefaultSession } from "next-auth"
import { UserType } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      userType: UserType
      clinicId?: string | null
      ownedClinicId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    userType: UserType
    clinicId?: string | null
    ownedClinicId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType: UserType
    clinicId?: string | null
    ownedClinicId?: string | null
  }
}
