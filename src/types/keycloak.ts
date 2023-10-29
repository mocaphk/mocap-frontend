/* eslint-disable @typescript-eslint/naming-convention */
export interface KeycloakAccessTokenPayload {
    "allowed-origins"?: string[];
    realm_access?: Record<"roles", string[]>;
    resource_access?: Record<string, Record<"roles", string[]>>;
}
