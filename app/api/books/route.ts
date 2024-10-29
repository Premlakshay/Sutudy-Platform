import connectDB from "@/connectDb/connectDB";
import BooksCategory from "@/modals/BooksCategory";
import subBooks from "@/modals/subBooks";
import { NextResponse, NextRequest } from "next/server";
export async function GET(req: NextRequest){
    await connectDB();
    const courseMap = new Map();
    const courses = await BooksCategory.find();
    const sCourses= await subBooks.find();
    courses.forEach((course) => {
        courseMap.set(course._id.toString(), { ...course.toObject(), subBooks: [] });
    });
    sCourses.forEach((sCourse) => {
        const course = courseMap.get(sCourse.bId.toString());
        if (course) {
            course.subBooks.push(sCourse);
        }
    });
    const result = Array.from(courseMap.values());
    return NextResponse.json({ courses: result });
}