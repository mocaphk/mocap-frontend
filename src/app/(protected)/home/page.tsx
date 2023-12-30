import Calendar from "./components/Calendar";
import CourseList from "./components/CourseList";
import TaskCompletion from "./components/TaskCompletion";

export default async function HomePage() {
    return (
        // min-width follows task completion chart
        <div className="flex flex-col gap-5 min-w-[550px]">
            <CourseList />
            <div className="flex flex-row flex-wrap gap-5">
                <div className="flex-[2]">
                    <Calendar />
                </div>
                <div className="flex-1 min-w-[550px]">
                    <TaskCompletion />
                </div>
            </div>
        </div>
    );
}
