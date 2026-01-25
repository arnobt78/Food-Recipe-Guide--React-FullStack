/**
 * NextAuth API Route Handler
 * 
 * Handles all NextAuth authentication routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback
 * - /api/auth/session
 * - etc.
 * 
 * Following DEVELOPMENT_RULES.md: Centralized API routes
 */

import { handlers } from "../../../../auth";

export const { GET, POST } = handlers;

