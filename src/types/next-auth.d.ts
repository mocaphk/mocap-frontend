import { type Account } from "next-auth";

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: Account["access_token"];
        accessTokenType?: Account["token_type"];
        expiresAt?: Account["expires_at"];
        refreshToken?: Account["refresh_token"];
        provider: Account["provider"];
        idToken: Account["id_token"];
        error?: "RefreshAccessTokenError";
        roles?: string[];
    }
}

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        accessToken?: Account["access_token"];
        accessTokenType?: Account["token_type"];
        error?: "RefreshAccessTokenError";
        roles?: string[];
    }
}

export {};
