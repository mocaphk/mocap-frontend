export interface EditableAnnouncementProps {
    isNew: boolean;
    id: string;
    courseId: string;
    title: string;
    content: string;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}
