import Calendar from "./components/Calendar";
import CourseList from "./components/CourseList";
import TaskCompletion from "./components/TaskCompletion";

export default async function HomePage() {
    return (
        <div className="flex flex-col space-y-5">
            <CourseList />
            <div className="flex flex-row space-x-5">
                <div className="basis-2/3">
                    <Calendar />
                </div>
                <div className="basis-1/3">
                    <TaskCompletion />
                </div>
            </div>
        </div>
    );
}
