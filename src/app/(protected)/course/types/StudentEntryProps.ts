export interface StudentEntryProps {
    name: string;
    uid: string;
    showDeleteButton: boolean;
    deleteFunction?: React.ComponentProps<"button">["onClick"];
    deleteConfirmBoxContent?: string;
    deleteRequireConfirm?: boolean;
}
