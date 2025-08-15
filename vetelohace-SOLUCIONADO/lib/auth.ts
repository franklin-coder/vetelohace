
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            clinic: true,
            ownedClinic: true
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          clinicId: user.clinicId,
          ownedClinicId: user.ownedClinic?.id
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userType = user.userType
        token.clinicId = user.clinicId
        token.ownedClinicId = user.ownedClinicId
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.sub as string
        session.user.userType = token.userType as any
        session.user.clinicId = token.clinicId as string | null
        session.user.ownedClinicId = token.ownedClinicId as string | null
      }
      return session
    }
  },
  pages: {
    signIn: "/",
  }
}
