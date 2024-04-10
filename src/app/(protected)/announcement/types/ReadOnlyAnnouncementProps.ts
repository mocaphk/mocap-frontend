export interface ReadOnlyAnnouncementProps {
    title: string;
    content: string;
    createdBy: string;
    date: string;
    lastEdit: string;
    allowEdit: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
