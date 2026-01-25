/**
 * NextAuth v5 Configuration
 * 
 * Authentication configuration using NextAuth v5 (Auth.js)
 * Supports Google OAuth provider
 * 
 * Following DEVELOPMENT_RULES.md: Centralized auth, TypeScript, proper types
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * NextAuth configuration
 * Uses Google OAuth provider for authentication
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    /**
     * JWT callback - runs whenever a JWT is accessed
     * Used to add custom claims to the token
     */
    async jwt({ token, user, account }) {
      // Initial sign in - add user info to token
      if (user) {
        // NextAuth doesn't provide user.id by default, so we generate one from email
        token.id = user.email?.split("@")[0] + "_" + Date.now() || `user_${Date.now()}`;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      
      // Add access token from OAuth provider
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      
      return token;
    },
    
    /**
     * Session callback - runs whenever a session is checked
     * Used to customize the session object returned to client
     */
    async session({ session, token }) {
      // Add user ID and access token to session
      if (session.user) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/", // Custom sign-in page (we'll use our own dialog)
  },
  session: {
    strategy: "jwt", // Use JWT strategy for better Next.js App Router compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
});
