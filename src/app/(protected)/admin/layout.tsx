import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { Roles } from "@/enums/roles";
import Error401 from "@/app/errors/401";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.roles?.includes(Roles.Admin)) {
        return <Error401></Error401>;
    }

    return <>{children}</>;
}
