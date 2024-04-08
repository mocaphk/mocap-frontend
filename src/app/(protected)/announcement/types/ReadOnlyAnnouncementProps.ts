export interface ReadOnlyAnnouncementProps {
    title: string;
    content: string;
    createdBy: string;
    date: string;
    lastEdit: string;
    isLecturerOrTutor: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
