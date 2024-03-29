import type { NotificationTypes } from "@/enums/notificationTypes";

export interface NotificationProps {
    type: NotificationTypes;
    title: string;
    createdAt: string;
    courseCode: string;
    year: string;
    itemId: string;
    link: string;
}
