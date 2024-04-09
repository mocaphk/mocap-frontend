import type { UserRole } from "@schema";

export interface UserEntryProps {
    name: string;
    roles: UserRole[];
    showDeleteButton: boolean;
    deleteFunction?: React.ComponentProps<"button">["onClick"];
    deleteConfirmBoxContent?: string;
    deleteRequireConfirm?: boolean;
}
