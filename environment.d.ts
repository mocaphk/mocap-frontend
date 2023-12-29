/* eslint-disable @typescript-eslint/naming-convention */

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_API_URL: string;
            NEXTAUTH_URL: string;
            NEXTAUTH_SECRET: string;
            KEYCLOAK_URL: string;
            KEYCLOAK_CLIENT_ID: string;
            KEYCLOAK_CLIENT_SECRET: string;
            KEYCLOAK_REALM: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
