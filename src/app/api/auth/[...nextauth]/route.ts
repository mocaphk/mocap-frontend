import type { AxiosError } from "axios";
import axios from "axios";
import moment from "moment";
import NextAuth, { type AuthOptions, type TokenSet } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt_decode from "jwt-decode";
import type { KeycloakAccessTokenPayload } from "@/types/keycloak";

async function refreshAccessToken(refreshToken: JWT["refreshToken"]) {
    if (!refreshToken) {
        throw new Error("RefreshAccessTokenError");
    }

    try {
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("client_id", process.env.KEYCLOAK_CLIENT_ID);
        params.append("client_secret", process.env.KEYCLOAK_CLIENT_SECRET);
        params.append("refresh_token", refreshToken);

        const token = await axios.post(
            `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
            params
        );

        return token.data as TokenSet;
    } catch (error) {
        throw new Error("RefreshAccessTokenError");
    }
}

// Force ending session in keycloak
async function doFinalSignoutHandshake(jwt: JWT) {
    const { provider, idToken } = jwt;

    if (provider === "keycloak") {
        try {
            const params = new URLSearchParams();
            params.append("id_token_hint", idToken ?? "");
            await axios.get(
                `${process.env.KEYCLOAK_URL}/realms/${
                    process.env.KEYCLOAK_REALM
                }/protocol/openid-connect/logout?${params.toString()}`
            );
        } catch (err) {
            console.error(
                "Unable to perform post-logout handshake",
                (err as AxiosError)?.code || err
            );
        }
    }
}

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
        }),
    ],
    events: {
        signOut: ({ token }) => doFinalSignoutHandshake(token),
    },
    callbacks: {
        async jwt({ token, account }) {
            // Save the access token and refresh token in the JWT on the initial login
            if (account) {
                let roles: string[] = [];

                if (account.access_token) {
                    const jwt = jwt_decode<KeycloakAccessTokenPayload>(
                        account.access_token
                    );
                    if (
                        jwt.resource_access &&
                        jwt.resource_access[process.env.KEYCLOAK_CLIENT_ID]
                    ) {
                        roles =
                            jwt.resource_access[process.env.KEYCLOAK_CLIENT_ID][
                                "roles"
                            ];
                    }
                }

                return {
                    ...token,
                    accessToken: account.access_token,
                    expiresAt: account.expires_at,
                    refreshToken: account.refresh_token,
                    accessTokenType: account.token_type,
                    provider: account.provider,
                    idToken: account.id_token,
                    roles: roles,
                } as JWT;
            }

            // If the access token has not expired yet, return it
            if (
                token.expiresAt &&
                moment().isBefore(moment(token.expiresAt, "X"))
            ) {
                return token;
            }

            // If the access token has expired, try to refresh it
            try {
                const newToken = await refreshAccessToken(token.refreshToken);
                return {
                    ...token,
                    accessToken: newToken.access_token,
                    accessTokenType: newToken.token_type,
                    expiresAt: newToken.expires_at,
                    refreshToken: newToken.refresh_token ?? token.refresh_token,
                } as JWT;
            } catch (err) {
                return {
                    ...token,
                    error: "RefreshAccessTokenError" as const,
                } as JWT;
            }
        },
        async session({ session, token }) {
            if (session) {
                session.accessToken = token.accessToken;
                session.accessTokenType = token.accessTokenType;
                session.error = token.error;
                session.roles = token.roles;
            }
            return session;
        },
    },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
