import connectDB from "@/connectDb/connectDB";
import Courses from "@/modals/Courses";
import subCourses from "@/modals/SubCourse";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import BuyCourse from "@/modals/buyCourse";
export async function GET(req: NextRequest){
    await connectDB();
    const courseMap = new Map();
    const courses = await Courses.find();
    const sCourses= await subCourses.find();
    courses.forEach((course) => {
        courseMap.set(course._id.toString(), { ...course.toObject(), subCourses: [] });
    });
    sCourses.forEach((sCourse) => {
        const course = courseMap.get(sCourse.cId.toString());
        if (course) {
            course.subCourses.push(sCourse);
        }
    });
    const result = Array.from(courseMap.values());
    return NextResponse.json({ courses: result });
}
export async function POST(req: NextRequest){
    const {_id} = await req.json();
    const course = await subCourses.findById(_id);
    const user = await currentUser();
    if(course){
        if(course.price != "Free"){
            const course12 = await BuyCourse.findOne({cId: _id, email: user?.emailAddresses[0].emailAddress});
            const date = new Date();
            if(course12){
                if(date > course12.endDate){
                    await BuyCourse.deleteOne({cId: _id, email: user?.emailAddresses[0].emailAddress});
                    return NextResponse.json({ course, exp: true}); 
                }else{
                    return NextResponse.json({ course, exp: false });
                }
            }else{
                return NextResponse.json({course, exp: true})
            }
        }else{
            return NextResponse.json({ course, exp: false });
        }
    }else{
        return NextResponse.json({message: "Invalid"});
    }
}