import CourseCard from "./components/CourseCard";

export default async function HomePage() {
    return (
        <div>
            This is home page.
            <br />
            You can only access this page if you are logged in.
            <br />
            <CourseCard
                courseTitle="ENGG1330 Computer Programming I"
                courseShortDescription="Python Introductory Course"
                createdBy="Schnieders Dirk"
                barColor="red"
            />
        </div>
    );
}
