/* eslint-disable @typescript-eslint/naming-convention */
export interface KeycloakAccessTokenPayload {
    "allowed-origins"?: string[];
    realm_access?: Record<"roles", string[]>;
    resource_access?: Record<string, Record<"roles", string[]>>;
}

export type KeycloakRefreshTokenResponse = {
    access_token: string;
    expires_in: string;
    refresh_expires_in: string;
    refresh_token: string;
    token_type: string;
    "not-before-policy": string;
    session_state: string;
    scope: string;
} | null;
