import { redirect } from "next/navigation";

export default async function Register() {
    const url = new URL(
        `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/registrations`
    );
    url.searchParams.append("client_id", process.env.KEYCLOAK_CLIENT_ID);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "openid email");
    url.searchParams.append("redirect_uri", process.env.NEXTAUTH_URL ?? "");

    redirect(url.toString());
}
