import type { NotificationTypes } from "@/enums/notificationTypes";

export interface NotificationProps {
    id: string;
    type: NotificationTypes;
    title: string;
    date: string;
    courseCode: string;
    link: string;
    isRead: boolean;
}
